import re
from pydantic import BaseModel,EmailStr,field_validator
from typing import Optional,List
from datetime import datetime


def _check_password(v: str) -> str:
    if len(v) < 8 or len(v) > 128 or not re.search(r"[A-Za-z]", v) or not re.search(r"\d", v):
        raise ValueError("Password must be 8-128 characters and include a letter and a number")
    return v


def _check_token(v: str) -> str:
    if len(v) < 20 or len(v) > 4096:
        raise ValueError("Invalid token")
    return v


class UserCreate(BaseModel):
    name:str
    email:EmailStr
    password:str

    @field_validator("name")
    @classmethod
    def name_length(cls,v:str)->str:
        v=v.strip()
        if not v:
            raise ValueError("Name is required")
        if len(v)>100:
            raise ValueError("Name must be at most 100 characters")
        return v

    @field_validator("password")
    @classmethod
    def strong_password(cls,v:str)->str:
        return _check_password(v)


class UserUpdate(BaseModel):
    name:Optional[str]=None
    email:Optional[EmailStr]=None

    @field_validator("name")
    @classmethod
    def name_length(cls,v:Optional[str])->Optional[str]:
        if v is None:
            return v
        v=v.strip()
        if len(v)>100:
            raise ValueError("Name must be at most 100 characters")
        return v


class UserResponse(BaseModel):
    id:int
    name:str
    email:EmailStr
    created_at:datetime
    updated_at:datetime


class PaginationResponse(BaseModel):

    page:int
    limit:int
    total_user:int
    total_pages:int
    users:List[UserResponse]=None


class ForgotPassword(BaseModel):
    email:EmailStr


class VerifyEmail(BaseModel):
    token:str

    @field_validator("token")
    @classmethod
    def token_length(cls,v:str)->str:
        return _check_token(v)


class ResetPassword(BaseModel):
    token:str
    new_password:str

    @field_validator("token")
    @classmethod
    def token_length(cls,v:str)->str:
        return _check_token(v)

    @field_validator("new_password")
    @classmethod
    def strong_password(cls,v:str)->str:
        return _check_password(v)


class ChangePassword(BaseModel):
    current_password:str
    new_password:str

    @field_validator("new_password")
    @classmethod
    def strong_password(cls,v:str)->str:
        return _check_password(v)


class FirebaseLogin(BaseModel):
    id_token:str

    @field_validator("id_token")
    @classmethod
    def token_length(cls,v:str)->str:
        return _check_token(v)
