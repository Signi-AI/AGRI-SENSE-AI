import secrets
from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.audit import log_security
from app.core.config import settings
from app.core.security import (
    DUMMY_PASSWORD_HASH,
    Hash,
    create_access_token,
    create_purpose_token,
    decode_purpose_token,
    verify_google_id_token,
)
from app.models.revoke import Revoke
from app.models.role import Role
from app.models.user import User
from app.models.userRole import UserRole
from app.schemas.user import UserCreate
from app.services.email_service import send_security_email

# Deliberately identical responses for "exists" and "does not exist".
REGISTER_MESSAGE = {
    "message": "If this email is not already registered, your account is ready. "
               "Please sign in or check your inbox to verify your email."
}
LOGIN_MESSAGE = "Invalid email or password"
FORGOT_MESSAGE = {
    "message": "If this email is registered, a password reset link has been sent."
}


def _email(value: str) -> str:
    return value.strip().lower()


def _verification_required() -> bool:
    # Without SMTP there is no way to deliver a verification link, so we do
    # not lock newly created accounts out. Set both settings in production.
    return bool(settings.REQUIRE_EMAIL_VERIFICATION and settings.SMTP_HOST)


def _assign_default_role(db: Session, user: User) -> None:
    # Emails listed in ADMIN_EMAILS become admins on signup; everyone else is a
    # farmer. The same list is used at startup to keep/promote those accounts.
    admin_emails = {
        item.strip().lower()
        for item in settings.ADMIN_EMAILS.split(",")
        if item.strip()
    }
    role_name = "admin" if user.email.strip().lower() in admin_emails else "farmer"
    role = db.query(Role).filter(Role.name == role_name).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Roles are not initialized. Run the database migration and seed, then retry.",
        )
    db.add(UserRole(user_id=user.id, role_id=role.id))
    db.commit()


def _send_link(email: str, purpose: str, link: str) -> None:
    subject = "Verify your AgriSense AI email" if purpose == "verify" else "Reset your AgriSense AI password"
    body = (
        f"Hello,\n\nOpen this link to continue: {link}\n\n"
        "If you did not request this, you can ignore this email.\n"
    )
    send_security_email(email, subject, body)


class AuthServise():

    @staticmethod
    def registeruser(data: UserCreate, db: Session, ip: str = ""):
        email = _email(data.email)

        # Same status and message whether the email exists or not.
        if db.query(User).filter(User.email == email).first():
            log_security("register_duplicate", ip=ip, email=email)
            return REGISTER_MESSAGE

        user = User(
            name=data.name.strip(),
            password=Hash.password_hash(data.password),
            email=email,
            is_verified=not _verification_required(),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        _assign_default_role(db, user)

        if _verification_required():
            token = create_purpose_token(email, "verify", settings.VERIFY_TOKEN_EXPIRE, user.token_version)
            link = f"{settings.FRONTEND_URL.rstrip('/')}/auth?verify=true&token={token}"
            _send_link(email, "verify", link)

        log_security("register", ip=ip, email=email, user_id=user.id)
        return REGISTER_MESSAGE

    @staticmethod
    def loginuser(db: Session, email: str, password: str, ip: str = ""):
        email = _email(email)
        user = db.query(User).filter(User.email == email).first()

        # Verify against a dummy hash for unknown emails to keep timing similar.
        valid = Hash.verify_password(password, user.password if user else DUMMY_PASSWORD_HASH)
        if not user or not valid:
            if user:
                user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
                if user.failed_login_attempts >= settings.MAX_FAILED_LOGINS:
                    user.locked_until = datetime.now() + timedelta(minutes=settings.LOCKOUT_MINUTES)
                    log_security("login_locked", ip=ip, email=email, user_id=user.id)
                db.commit()
            log_security("login_failed", ip=ip, email=email)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=LOGIN_MESSAGE)

        if user.locked_until and user.locked_until > datetime.now():
            log_security("login_blocked_locked", ip=ip, email=email, user_id=user.id)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=LOGIN_MESSAGE)

        if _verification_required() and not user.is_verified:
            log_security("login_unverified", ip=ip, email=email, user_id=user.id)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please verify your email before signing in.",
            )

        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()
        token = create_access_token({"sub": user.email}, user.token_version)
        log_security("login_success", ip=ip, email=email, user_id=user.id)
        return {"access_token": token, "token_type": "Bearer"}

    @staticmethod
    def verify_email(token: str, db: Session, ip: str = ""):
        payload = decode_purpose_token(token, "verify")
        if not payload:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification link")

        user = db.query(User).filter(User.email == _email(payload["sub"])).first()
        if not user or payload.get("ver", 0) != user.token_version:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired verification link")

        user.is_verified = True
        db.commit()
        log_security("email_verified", ip=ip, email=user.email, user_id=user.id)
        return {"message": "Email verified. You can now sign in."}

    @staticmethod
    def forgot_password(email: str, db: Session, ip: str = ""):
        email = _email(email)
        user = db.query(User).filter(User.email == email).first()
        if user:
            token = create_purpose_token(email, "reset", settings.RESET_TOKEN_EXPIRE, user.token_version)
            link = f"{settings.FRONTEND_URL.rstrip('/')}/auth?reset=true&token={token}"
            _send_link(email, "reset", link)
            log_security("password_reset_requested", ip=ip, email=email, user_id=user.id)
        else:
            log_security("password_reset_unknown_email", ip=ip, email=email)
        return FORGOT_MESSAGE

    @staticmethod
    def reset_password(token: str, new_password: str, db: Session, ip: str = ""):
        payload = decode_purpose_token(token, "reset")
        if not payload:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link")

        user = db.query(User).filter(User.email == _email(payload["sub"])).first()
        if not user or payload.get("ver", 0) != user.token_version:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired reset link")

        user.password = Hash.password_hash(new_password)
        user.token_version += 1
        user.failed_login_attempts = 0
        user.locked_until = None
        db.query(Revoke).filter(Revoke.user_id == user.id).delete()
        db.commit()
        log_security("password_reset_completed", ip=ip, email=user.email, user_id=user.id)
        return {"message": "Password updated. Please sign in with your new password."}

    @staticmethod
    def firebase_login(id_token: str, db: Session, ip: str = ""):
        claims = verify_google_id_token(id_token)
        if not claims:
            log_security("firebase_rejected", ip=ip)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or unverified Google account.",
            )

        email = _email(claims["email"])
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(
                name=(claims.get("name") or email.split("@")[0])[:100],
                password=Hash.password_hash(secrets.token_urlsafe(32)),
                email=email,
                is_verified=True,  # Google already verified this email address.
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            _assign_default_role(db, user)
            log_security("firebase_user_created", ip=ip, email=email, user_id=user.id)

        if user.locked_until and user.locked_until > datetime.now():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=LOGIN_MESSAGE)

        user.failed_login_attempts = 0
        user.locked_until = None
        db.commit()
        token = create_access_token({"sub": user.email}, user.token_version)
        log_security("firebase_login_success", ip=ip, email=email, user_id=user.id)
        return {"access_token": token, "token_type": "Bearer"}

    @staticmethod
    def logout(token: str, db: Session, current_user):
        revoke = db.query(Revoke).filter(Revoke.token == token).first()
        if revoke:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="already logged out,please login again")

        # Fixed: this used to be `revoke.token == token` (a comparison).
        db.add(Revoke(token=token, user_id=current_user.id))
        cutoff = datetime.now() - timedelta(minutes=settings.EXPIRE_ACCESS_TOKEN)
        db.query(Revoke).filter(Revoke.revoked_at < cutoff).delete()
        db.commit()
        log_security("logout", ip="", email=current_user.email, user_id=current_user.id)
        return {"message": "logout successful"}

    @staticmethod
    def logout_all(db: Session, current_user):
        current_user.token_version += 1
        db.query(Revoke).filter(Revoke.user_id == current_user.id).delete()
        db.commit()
        log_security("logout_all", ip="", email=current_user.email, user_id=current_user.id)
        return {"message": "Signed out of all devices. Please sign in again."}
