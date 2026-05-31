from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers

from .models import EmailOTP, TruckProfile, User, UserRole


class TruckProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TruckProfile
        fields = ('plate_number', 'brand', 'size_capacity', 'truck_type')


class UserSerializer(serializers.ModelSerializer):
    truck = TruckProfileSerializer(read_only=True)
    avatar_url = serializers.SerializerMethodField()
    role_label = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'phone',
            'full_name',
            'role',
            'role_label',
            'city',
            'company',
            'avatar_url',
            'is_verified',
            'truck',
        )
        read_only_fields = fields

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.avatar.url)
        return obj.avatar.url

    def get_role_label(self, obj):
        if obj.role == UserRole.DRIVER:
            return 'Truck owner'
        return 'Cargo client'


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('full_name', 'phone', 'city', 'company')

    def validate_phone(self, value):
        normalized = ''.join(c for c in value if c.isdigit() or c == '+')
        if not normalized:
            raise serializers.ValidationError('Enter a valid phone number.')
        user = self.context['request'].user
        if User.objects.filter(phone=normalized).exclude(pk=user.pk).exists():
            raise serializers.ValidationError('This phone number is already in use.')
        return normalized


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=32)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=UserRole.choices)
    company = serializers.CharField(max_length=150, required=False, allow_blank=True, default='')
    truck = TruckProfileSerializer(required=False)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value.lower().strip()

    def validate_phone(self, value):
        normalized = ''.join(c for c in value if c.isdigit() or c == '+')
        if not normalized:
            raise serializers.ValidationError('Enter a valid phone number.')
        if User.objects.filter(phone=normalized).exists():
            raise serializers.ValidationError('This phone number is already registered.')
        return normalized

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        validate_password(attrs['password'])

        role = attrs['role']
        truck = attrs.get('truck')
        if role == UserRole.DRIVER:
            if not truck:
                raise serializers.ValidationError({'truck': 'Truck details are required for truck owners.'})
            attrs['truck'] = {
                'plate_number': truck.get('plate_number') or truck.get('plate', ''),
                'brand': truck.get('brand', ''),
                'size_capacity': truck.get('size_capacity') or truck.get('size', ''),
                'truck_type': truck.get('truck_type') or truck.get('type', ''),
            }
        elif truck:
            raise serializers.ValidationError({'truck': 'Truck details are only for truck owners.'})

        company = (attrs.get('company') or '').strip()
        if role == UserRole.CARGO and not company:
            raise serializers.ValidationError({'company': 'Company name is required for cargo clients.'})
        attrs['company'] = company
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        truck_data = validated_data.pop('truck', None)
        validated_data.pop('password_confirm')

        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data['phone'],
            full_name=validated_data['full_name'].strip(),
            role=validated_data['role'],
            company=validated_data.get('company', ''),
            is_verified=False,
        )

        if user.role == UserRole.DRIVER and truck_data:
            TruckProfile.objects.create(user=user, **truck_data)

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=UserRole.choices)

    def validate_email(self, value):
        return value.lower().strip()

    def validate(self, attrs):
        email = attrs['email']
        password = attrs['password']
        expected_role = attrs['role']

        user = User.objects.filter(email__iexact=email).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError({'detail': 'Invalid email or password.'})

        if not user.is_active:
            raise serializers.ValidationError({'detail': 'This account has been deactivated.'})

        if not user.is_verified:
            raise serializers.ValidationError(
                {'detail': 'Email not verified yet. Complete sign-up verification first.'}
            )

        if user.role != expected_role:
            if user.role == UserRole.DRIVER:
                raise serializers.ValidationError(
                    {'detail': 'This account is registered as a truck owner. Use truck owner login.'}
                )
            raise serializers.ValidationError(
                {'detail': 'This account is registered as a cargo client. Use client login.'}
            )

        attrs['user'] = user
        return attrs


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Code must be 6 digits.')
        return value

    def validate(self, attrs):
        email = attrs['email'].lower().strip()
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            raise serializers.ValidationError({'detail': 'Invalid verification request.'})

        otp = (
            EmailOTP.objects.filter(
                user=user,
                purpose=EmailOTP.Purpose.VERIFY,
                consumed_at__isnull=True,
            )
            .order_by('-created_at')
            .first()
        )
        if otp is None or not otp.is_valid:
            raise serializers.ValidationError({'detail': 'No active verification code. Request a new one.'})

        if otp.attempts >= settings.OTP_MAX_ATTEMPTS:
            raise serializers.ValidationError({'detail': 'Too many attempts. Request a new code.'})

        from .otp import verify_otp_code

        otp.attempts += 1
        otp.save(update_fields=['attempts'])

        if not verify_otp_code(attrs['code'], otp.code_hash):
            raise serializers.ValidationError({'detail': 'Invalid verification code.'})

        attrs['user'] = user
        attrs['otp'] = otp
        return attrs


class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower().strip()


class VerifyPasswordResetOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)

    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError('Code must be 6 digits.')
        return value

    def validate(self, attrs):
        email = attrs['email'].lower().strip()
        user = User.objects.filter(email__iexact=email, is_active=True).first()
        if user is None:
            raise serializers.ValidationError({'detail': 'Invalid reset request.'})

        otp = (
            EmailOTP.objects.filter(
                user=user,
                purpose=EmailOTP.Purpose.RESET,
                consumed_at__isnull=True,
            )
            .order_by('-created_at')
            .first()
        )
        if otp is None or not otp.is_valid:
            raise serializers.ValidationError({'detail': 'No active reset code. Request a new one.'})

        if otp.attempts >= settings.OTP_MAX_ATTEMPTS:
            raise serializers.ValidationError({'detail': 'Too many attempts. Request a new code.'})

        from .otp import verify_otp_code

        otp.attempts += 1
        otp.save(update_fields=['attempts'])

        if not verify_otp_code(attrs['code'], otp.code_hash):
            raise serializers.ValidationError({'detail': 'Invalid verification code.'})

        attrs['user'] = user
        attrs['otp'] = otp
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    reset_token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        return value.lower().strip()

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match.'})
        validate_password(attrs['password'])

        from .password_reset import verify_reset_token

        user = User.objects.filter(email__iexact=attrs['email'], is_active=True).first()
        if user is None or not verify_reset_token(attrs['reset_token'], user.id):
            raise serializers.ValidationError({'detail': 'Invalid or expired reset session. Start again.'})

        attrs['user'] = user
        return attrs
