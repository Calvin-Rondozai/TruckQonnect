# TruckQonnect API (Django)

Backend for the mobile app. **Phase 1:** registration, login, and email OTP verification.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # then edit .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

## Environment (`.env` only — never commit)

| Variable | Purpose |
|----------|---------|
| `DJANGO_SECRET_KEY` | Signing key (long random string) |
| `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | Gmail SMTP (prefer [App Password](https://myaccount.google.com/apppasswords)) |
| `DJANGO_ALLOWED_HOSTS` | Add your LAN IP for physical devices |

For Android emulator, use `http://10.0.2.2:8000` as the API base URL.  
For a phone on the same Wi‑Fi, use `http://<your-pc-ip>:8000`.

## Auth API (`/api/v1/auth/`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `register/` | Create account (`role`: `cargo` or `driver`) → sends OTP email |
| POST | `login/` | `phone` or `email` + `password` → sends OTP email |
| POST | `otp/verify/` | `email` + 6-digit `code` → JWT tokens + user profile |
| POST | `otp/resend/` | `email` → new code (rate limited) |
| GET | `me/` | Current user (Bearer token) |

### Register body (driver example)

```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+263771234567",
  "password": "securepass1",
  "password_confirm": "securepass1",
  "role": "driver",
  "truck": {
    "plate_number": "ABC 1234",
    "brand": "Volvo",
    "size_capacity": "30 Ton",
    "truck_type": "Flatbed"
  }
}
```

OTP is always delivered to **email**, not SMS.
