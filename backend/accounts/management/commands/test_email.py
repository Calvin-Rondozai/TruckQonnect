from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Send a test email using current EMAIL_* settings from .env'

    def handle(self, *args, **options):
        to = settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL
        if not to and not settings.EMAIL_USE_CONSOLE:
            self.stderr.write(
                self.style.ERROR('Set EMAIL_HOST_USER in backend/.env before testing SMTP.')
            )
            return

        recipient = to or 'dev@localhost'
        self.stdout.write(f'Backend: {settings.EMAIL_BACKEND}')
        if not settings.EMAIL_USE_CONSOLE:
            self.stdout.write(f'SMTP: {settings.EMAIL_HOST}:{settings.EMAIL_PORT} as {settings.EMAIL_HOST_USER}')

        try:
            send_mail(
                subject='TruckQonnect email test',
                message='If you received this, SMTP is configured correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f'FAILED: {type(exc).__name__}: {exc}'))
            self.stderr.write(
                '\nGmail fix:\n'
                '  1. Enable 2-Step Verification on the Google account\n'
                '  2. Create an App Password: https://myaccount.google.com/apppasswords\n'
                '  3. Put the 16-character app password in backend/.env as EMAIL_HOST_PASSWORD\n'
                '  4. Or set EMAIL_USE_CONSOLE=True to print OTP codes in the runserver terminal\n'
            )
            return

        if settings.EMAIL_USE_CONSOLE:
            self.stdout.write(self.style.SUCCESS('OK — email printed above (console backend).'))
        else:
            self.stdout.write(self.style.SUCCESS(f'OK — test email sent to {recipient}.'))
