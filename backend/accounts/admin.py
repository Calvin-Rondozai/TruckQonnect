from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import EmailOTP, TruckProfile, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    ordering = ('email',)
    list_display = ('email', 'full_name', 'phone', 'role', 'is_verified', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_verified', 'is_staff')
    search_fields = ('email', 'phone', 'full_name')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Profile', {'fields': ('full_name', 'phone', 'role')}),
        ('Status', {'fields': ('is_verified', 'is_active', 'is_staff', 'is_superuser')}),
        ('Permissions', {'fields': ('groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'phone', 'full_name', 'role', 'password1', 'password2'),
            },
        ),
    )


@admin.register(TruckProfile)
class TruckProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'plate_number', 'brand', 'truck_type')
    search_fields = ('user__email', 'plate_number')


@admin.register(EmailOTP)
class EmailOTPAdmin(admin.ModelAdmin):
    list_display = ('user', 'purpose', 'expires_at', 'attempts', 'consumed_at', 'created_at')
    list_filter = ('purpose',)
    readonly_fields = ('code_hash',)
