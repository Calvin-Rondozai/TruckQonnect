import logging
from typing import Optional

from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailOTP, User
from .otp import can_resend, create_and_send_otp, resend_otp
from .password_reset import create_reset_token
from .serializers import (
    ForgotPasswordSerializer,
    LoginSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    ResendOTPSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    VerifyOTPSerializer,
    VerifyPasswordResetOtpSerializer,
)
from .throttles import AuthRateThrottle, OTPRateThrottle

logger = logging.getLogger(__name__)


def issue_tokens(user: User) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def mask_email(email: str) -> str:
    local, _, domain = email.partition('@')
    if len(local) <= 2:
        masked_local = local[0] + '***' if local else '***'
    else:
        masked_local = local[0] + '***' + local[-1]
    return f'{masked_local}@{domain}'


def otp_delivery_meta() -> dict:
    if settings.EMAIL_USE_CONSOLE:
        return {'otp_delivery': 'console'}
    return {'otp_delivery': 'email'}


def dev_otp_payload(code: Optional[str]) -> dict:
    """Include OTP in API response during local dev (console email backend only)."""
    if settings.DEBUG and settings.EMAIL_USE_CONSOLE and code:
        return {'dev_otp': code}
    return {}


class RegisterView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        try:
            _, otp_code = create_and_send_otp(user, EmailOTP.Purpose.VERIFY)
        except Exception as exc:
            logger.exception('Register OTP email failed for %s: %s', user.email, exc)
            user.delete()
            detail = 'Could not send verification email. Check server email settings.'
            if settings.DEBUG:
                detail += (
                    ' Gmail requires an App Password (not your normal password). '
                    'Run: python manage.py test_email'
                )
            return Response({'detail': detail}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(
            {
                'message': 'Account created. Enter the verification code sent to your email.',
                'email': user.email,
                'email_masked': mask_email(user.email),
                'role': user.role,
                'requires_otp': True,
                **otp_delivery_meta(),
                **dev_otp_payload(otp_code),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = issue_tokens(user)

        return Response(
            {
                'message': 'Signed in successfully.',
                'user': UserSerializer(user, context={'request': request}).data,
                'tokens': tokens,
            },
            status=status.HTTP_200_OK,
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        otp = serializer.validated_data['otp']

        otp.consumed_at = timezone.now()
        otp.save(update_fields=['consumed_at'])

        if not user.is_verified:
            user.is_verified = True
            user.save(update_fields=['is_verified'])

        tokens = issue_tokens(user)

        return Response(
            {
                'message': 'Verified successfully.',
                'user': UserSerializer(user, context={'request': request}).data,
                'tokens': tokens,
            },
            status=status.HTTP_200_OK,
        )


class ResendOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].lower().strip()
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            return Response(
                {'message': 'If an account exists, a new code has been sent.'},
                status=status.HTTP_200_OK,
            )

        latest = (
            EmailOTP.objects.filter(
                user=user,
                purpose=EmailOTP.Purpose.VERIFY,
                consumed_at__isnull=True,
            )
            .order_by('-created_at')
            .first()
        )
        if latest and not can_resend(latest):
            wait = max(
                1,
                int(
                    settings.OTP_RESEND_COOLDOWN_SECONDS
                    - (timezone.now() - latest.last_sent_at).total_seconds()
                ),
            )
            return Response(
                {'detail': f'Please wait {wait} seconds before requesting a new code.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp_code = None
        try:
            _, otp_code = resend_otp(user, EmailOTP.Purpose.VERIFY)
        except Exception:
            return Response(
                {'detail': 'Could not send email. Try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                'message': 'A new verification code has been sent.',
                'email_masked': mask_email(user.email),
                **otp_delivery_meta(),
                **dev_otp_payload(otp_code),
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user, context={'request': request}).data)

    def patch(self, request):
        serializer = ProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={'request': request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(request.user, context={'request': request}).data)


class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        avatar = request.FILES.get('avatar')
        if not avatar:
            return Response({'detail': 'No image uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        if avatar.size > 5 * 1024 * 1024:
            return Response({'detail': 'Image must be under 5 MB.'}, status=status.HTTP_400_BAD_REQUEST)

        allowed = ('image/jpeg', 'image/png', 'image/webp', 'image/jpg')
        if avatar.content_type not in allowed:
            return Response({'detail': 'Use JPEG, PNG, or WebP.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if user.avatar:
            user.avatar.delete(save=False)
        user.avatar = avatar
        user.save(update_fields=['avatar'])

        return Response(UserSerializer(user, context={'request': request}).data)


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        otp_code = None
        if user is not None:
            try:
                _, otp_code = create_and_send_otp(user, EmailOTP.Purpose.RESET)
            except Exception as exc:
                logger.exception('Password reset OTP email failed for %s: %s', email, exc)
                return Response(
                    {'detail': 'Could not send email. Try again later.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

        payload = {
            'message': 'If an account exists for this email, a reset code has been sent.',
            **otp_delivery_meta(),
            **dev_otp_payload(otp_code),
        }
        if user is not None:
            payload['email_masked'] = mask_email(user.email)

        return Response(payload, status=status.HTTP_200_OK)


class VerifyPasswordResetOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        serializer = VerifyPasswordResetOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        otp = serializer.validated_data['otp']

        otp.consumed_at = timezone.now()
        otp.save(update_fields=['consumed_at'])

        reset_token = create_reset_token(user.id)

        return Response(
            {
                'message': 'Code verified. Set your new password.',
                'email': user.email,
                'reset_token': reset_token,
            },
            status=status.HTTP_200_OK,
        )


class ResendPasswordResetOtpView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [OTPRateThrottle]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user is None:
            return Response(
                {'message': 'If an account exists, a new code has been sent.'},
                status=status.HTTP_200_OK,
            )

        latest = (
            EmailOTP.objects.filter(
                user=user,
                purpose=EmailOTP.Purpose.RESET,
                consumed_at__isnull=True,
            )
            .order_by('-created_at')
            .first()
        )
        if latest and not can_resend(latest):
            wait = max(
                1,
                int(
                    settings.OTP_RESEND_COOLDOWN_SECONDS
                    - (timezone.now() - latest.last_sent_at).total_seconds()
                ),
            )
            return Response(
                {'detail': f'Please wait {wait} seconds before requesting a new code.'},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        otp_code = None
        try:
            _, otp_code = resend_otp(user, EmailOTP.Purpose.RESET)
        except Exception:
            return Response(
                {'detail': 'Could not send email. Try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response(
            {
                'message': 'A new reset code has been sent.',
                'email_masked': mask_email(user.email),
                **otp_delivery_meta(),
                **dev_otp_payload(otp_code),
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AuthRateThrottle]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        user.set_password(serializer.validated_data['password'])
        user.save(update_fields=['password'])

        return Response(
            {'message': 'Password updated. You can sign in with your new password.'},
            status=status.HTTP_200_OK,
        )
