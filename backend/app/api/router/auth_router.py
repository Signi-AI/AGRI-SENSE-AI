from app.services.auth_servise import AuthServise
from fastapi import APIRouter,Depends
from app.schemas.user import UserCreate,UserResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer
from app.core.dependencies import get_current_user

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/api/auth/login")

router=APIRouter(prefix="/api/auth",tags=["Auth"])


@router.post("/register",response_model=UserResponse)
def register(data:UserCreate,db:Session=Depends(get_db)):
    return AuthServise.registeruser(data,db)
    
@router.post("/login")
def login(db:Session=Depends(get_db),
          data:OAuth2PasswordRequestForm=Depends()):
    return AuthServise.loginuser(db,data.username,data.password)

@router.post("/logout")
def logout(db:Session=Depends(get_db),
           token:str=Depends(oauth2_scheme),
           current_user:User=Depends(get_current_user)):
    return AuthServise.logout(token,db,current_user)
