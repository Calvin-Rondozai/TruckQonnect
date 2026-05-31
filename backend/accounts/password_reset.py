from django.core.signing import BadSignature, SignatureExpired, dumps, loads

SALT = 'truckqonnect.password-reset'
MAX_AGE_SECONDS = 15 * 60


def create_reset_token(user_id) -> str:
    return dumps({'user_id': str(user_id), 'purpose': 'password_reset'}, salt=SALT)


def verify_reset_token(token: str, user_id) -> bool:
    try:
        data = loads(token, salt=SALT, max_age=MAX_AGE_SECONDS)
    except (BadSignature, SignatureExpired):
        return False
    return data.get('user_id') == str(user_id) and data.get('purpose') == 'password_reset'
