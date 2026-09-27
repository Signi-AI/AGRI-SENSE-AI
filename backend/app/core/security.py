from jose import jwt,JWTError
from app.core.config import settings
from datetime import datetime,timedelta
from pwdlib import PasswordHash

hash_password=PasswordHash.recommended()


def create_access_token(data:dict):
    to_encode=data.copy()
    expireAt=datetime.now() +timedelta(minutes=settings.EXPIRE_ACCESS_TOKEN)
    to_encode.update({"exp":expireAt})
    token=jwt.encode(to_encode,settings.SECRET_KEY,algorithm=settings.ALGORITHM)
    return token


def decode_token(token:str):
    try:
        payload=jwt.decode(token,settings.SECRET_KEY,algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
    

class Hash():
    @staticmethod
    def password_hash(pasword):
        return hash_password.hash(pasword)
    
    @staticmethod
    def verify_password(plain_password,hashed_password):
        return hash_password.verify(plain_password,hashed_password)    
    
    
    