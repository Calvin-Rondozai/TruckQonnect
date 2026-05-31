from django.urls import path

from .views import (
    AvatarUploadView,
    ForgotPasswordView,
    LoginView,
    MeView,
    RegisterView,
    ResendOTPView,
    ResendPasswordResetOtpView,
    ResetPasswordView,
    VerifyOTPView,
    VerifyPasswordResetOtpView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('otp/verify/', VerifyOTPView.as_view(), name='auth-otp-verify'),
    path('otp/resend/', ResendOTPView.as_view(), name='auth-otp-resend'),
    path('password/forgot/', ForgotPasswordView.as_view(), name='auth-password-forgot'),
    path('password/verify-otp/', VerifyPasswordResetOtpView.as_view(), name='auth-password-verify-otp'),
    path('password/resend-otp/', ResendPasswordResetOtpView.as_view(), name='auth-password-resend-otp'),
    path('password/reset/', ResetPasswordView.as_view(), name='auth-password-reset'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('me/avatar/', AvatarUploadView.as_view(), name='auth-me-avatar'),
]
