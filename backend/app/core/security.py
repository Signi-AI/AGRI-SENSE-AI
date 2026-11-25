import uuid
from datetime import datetime, timedelta

import requests
from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings

hash_password = PasswordHash.recommended()


def create_access_token(data: dict, token_version: int = 0):
    """Create a login token. ``ver`` lets us invalidate all tokens at once."""
    to_encode = data.copy()
    expire_at = datetime.now() + timedelta(minutes=settings.EXPIRE_ACCESS_TOKEN)
    # jti makes every login unique. Without it, two logins in the same second
    # produce the same JWT and logging out one would revoke the other.
    to_encode.update({"exp": expire_at, "ver": token_version, "jti": str(uuid.uuid4())})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError:
        return None


def create_purpose_token(email: str, purpose: str, minutes: int, token_version: int = 0):
    """Short-lived token for email verification or password reset."""
    payload = {
        "sub": email,
        "purpose": purpose,
        "exp": datetime.now() + timedelta(minutes=minutes),
        # Binding to token_version makes a reset link single-use.
        "ver": token_version,
    }
    # A different key per purpose means a reset token can never be used as a
    # login credential (or as a verification token).
    return jwt.encode(
        payload,
        f"{settings.SECRET_KEY}-{purpose}",
        algorithm=settings.ALGORITHM,
    )


def decode_purpose_token(token: str, purpose: str):
    try:
        payload = jwt.decode(
            token,
            f"{settings.SECRET_KEY}-{purpose}",
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        return None
    if payload.get("purpose") != purpose:
        return None
    return payload


def verify_google_id_token(id_token: str):
    """Verify a Firebase/Google ID token with Google's public tokeninfo endpoint.

    Returns the verified claims, or None when the token is invalid, belongs to
    another Firebase project, or the email is not verified by Google.
    """
    if not id_token or len(id_token) > 4096:
        return None
    try:
        response = requests.get(
            settings.GOOGLE_TOKENINFO_URL,
            params={"id_token": id_token},
            timeout=10,
        )
        if response.status_code != 200:
            return None
        claims = response.json()
    except (requests.RequestException, ValueError):
        return None

    if claims.get("aud") != settings.FIREBASE_PROJECT_ID:
        return None
    if claims.get("email_verified") not in (True, "true"):
        return None
    email = claims.get("email")
    if not email:
        return None
    try:
        if int(claims.get("exp", 0)) <= datetime.now().timestamp():
            return None
    except (TypeError, ValueError):
        return None
    return claims


# Used when an email does not exist, so unknown and known emails take a
# similar amount of time to check (basic timing-attack mitigation).
DUMMY_PASSWORD_HASH = hash_password.hash("not-a-real-password")


class Hash():
    @staticmethod
    def password_hash(pasword):
        return hash_password.hash(pasword)

    @staticmethod
    def verify_password(plain_password, hashed_password):
        try:
            return hash_password.verify(plain_password, hashed_password)
        except (ValueError, TypeError):
            return False
