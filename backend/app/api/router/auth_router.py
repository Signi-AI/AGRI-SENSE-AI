from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.audit import client_ip
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import (
    FirebaseLogin,
    ForgotPassword,
    ResetPassword,
    UserCreate,
    VerifyEmail,
)
from app.services.auth_servise import AuthServise

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

router = APIRouter(prefix="/api/auth", tags=["Auth"])


@router.post("/register")
def register(data: UserCreate, request: Request, db: Session = Depends(get_db)):
    return AuthServise.registeruser(data, db, client_ip(request))


@router.post("/login")
def login(
    request: Request,
    db: Session = Depends(get_db),
    data: OAuth2PasswordRequestForm = Depends(),
):
    return AuthServise.loginuser(db, data.username, data.password, client_ip(request))


@router.post("/logout")
def logout(
    request: Request,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
):
    return AuthServise.logout(token, db, current_user)


@router.post("/logout-all")
def logout_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AuthServise.logout_all(db, current_user)


@router.post("/verify-email")
def verify_email(data: VerifyEmail, request: Request, db: Session = Depends(get_db)):
    return AuthServise.verify_email(data.token, db, client_ip(request))


@router.post("/forgot-password")
def forgot_password(data: ForgotPassword, request: Request, db: Session = Depends(get_db)):
    return AuthServise.forgot_password(data.email, db, client_ip(request))


@router.post("/reset-password")
def reset_password(data: ResetPassword, request: Request, db: Session = Depends(get_db)):
    return AuthServise.reset_password(data.token, data.new_password, db, client_ip(request))


@router.post("/firebase")
def firebase_login(data: FirebaseLogin, request: Request, db: Session = Depends(get_db)):
    return AuthServise.firebase_login(data.id_token, db, client_ip(request))
