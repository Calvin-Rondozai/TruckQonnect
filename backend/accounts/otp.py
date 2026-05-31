import secrets
from typing import Optional, Tuple

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.utils import timezone

from .models import EmailOTP, User


def generate_otp_code() -> str:
    return f'{secrets.randbelow(1_000_000):06d}'


def hash_otp_code(code: str) -> str:
    return make_password(code)


def verify_otp_code(code: str, code_hash: str) -> bool:
    return check_password(code, code_hash)


def invalidate_pending_otps(user: User, purpose: str) -> None:
    EmailOTP.objects.filter(
        user=user,
        purpose=purpose,
        consumed_at__isnull=True,
    ).update(consumed_at=timezone.now())


def can_resend(otp: Optional[EmailOTP]) -> bool:
    if otp is None:
        return True
    cooldown = settings.OTP_RESEND_COOLDOWN_SECONDS
    elapsed = (timezone.now() - otp.last_sent_at).total_seconds()
    return elapsed >= cooldown


def create_and_send_otp(user: User, purpose: str) -> Tuple[EmailOTP, str]:
    invalidate_pending_otps(user, purpose)

    code = generate_otp_code()
    expires_at = timezone.now() + timezone.timedelta(minutes=settings.OTP_EXPIRY_MINUTES)

    otp = EmailOTP.objects.create(
        user=user,
        purpose=purpose,
        code_hash=hash_otp_code(code),
        expires_at=expires_at,
    )

    if purpose == EmailOTP.Purpose.RESET:
        subject = 'TruckQonnect password reset code'
        body = (
            f'Hello {user.full_name},\n\n'
            f'Your password reset code is: {code}\n\n'
            f'This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.\n'
            f'If you did not request this, ignore this email.\n\n'
            f'— TruckQonnect'
        )
    elif purpose == EmailOTP.Purpose.LOGIN:
        subject = 'TruckQonnect verification code'
        body = (
            f'Hello {user.full_name},\n\n'
            f'Your login verification code is: {code}\n\n'
            f'This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.\n'
            f'If you did not request this, ignore this email.\n\n'
            f'— TruckQonnect'
        )
    else:
        subject = 'TruckQonnect verification code'
        body = (
            f'Hello {user.full_name},\n\n'
            f'Your account verification code is: {code}\n\n'
            f'This code expires in {settings.OTP_EXPIRY_MINUTES} minutes.\n\n'
            f'— TruckQonnect'
        )

    send_mail(
        subject=subject,
        message=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

    return otp, code


def resend_otp(user: User, purpose: str) -> Tuple[EmailOTP, Optional[str]]:
    latest = (
        EmailOTP.objects.filter(user=user, purpose=purpose, consumed_at__isnull=True)
        .order_by('-created_at')
        .first()
    )
    if latest and can_resend(latest):
        return create_and_send_otp(user, purpose)
    if latest and not can_resend(latest):
        return latest, None
    return create_and_send_otp(user, purpose)
