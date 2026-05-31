import uuid

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone


class UserRole(models.TextChoices):
    CARGO = 'cargo', 'Cargo owner'
    DRIVER = 'driver', 'Truck owner'


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_verified', True)
        extra_fields.setdefault('role', UserRole.CARGO)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=32, unique=True)
    full_name = models.CharField(max_length=150)
    role = models.CharField(max_length=10, choices=UserRole.choices)
    city = models.CharField(max_length=100, blank=True, default='')
    company = models.CharField(max_length=150, blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone', 'full_name', 'role']

    class Meta:
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['role']),
        ]

    def __str__(self):
        return f'{self.email} ({self.role})'


class TruckProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='truck')
    plate_number = models.CharField(max_length=32)
    brand = models.CharField(max_length=64)
    size_capacity = models.CharField(max_length=64)
    truck_type = models.CharField(max_length=64)

    def __str__(self):
        return f'{self.plate_number} — {self.user.email}'


class EmailOTP(models.Model):
    class Purpose(models.TextChoices):
        VERIFY = 'verify', 'Email verification'
        LOGIN = 'login', 'Login verification'
        RESET = 'reset', 'Password reset'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    purpose = models.CharField(max_length=10, choices=Purpose.choices)
    code_hash = models.CharField(max_length=128)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    consumed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'purpose', 'consumed_at']),
        ]

    @property
    def is_valid(self):
        return self.consumed_at is None and timezone.now() < self.expires_at
