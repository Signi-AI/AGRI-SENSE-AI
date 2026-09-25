from app.core.security import decode_token
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.role import Role
from app.models.userRole import UserRole
from fastapi import HTTPException,status,Depends
from fastapi.security import OAuth2PasswordBearer
from app.models.revoke import Revoke

oauth2_scheme=OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(access_token:str=Depends(oauth2_scheme),db:Session=Depends(get_db)):
    revoked=db.query(Revoke).filter(Revoke.token==access_token).first()
    if revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="please login again")
    
    payload=decode_token(access_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="expire or invalid token")
    
    email=payload.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="invalid credentials")
    
    user=db.query(User).filter(User.email==email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="invalid credentials")
    
    return user



def require_role(required_role:str):
    def role_Check(current_user=Depends(get_current_user),
                   db:Session=Depends(get_db)):
        roles=db.query(Role).join(UserRole,UserRole.role_id==Role.id).filter(UserRole.user_id==current_user.id).all()
        roles_name={role.name for role in roles}
        
        if "admin" in roles_name:
            return current_user
        if required_role not in roles_name:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="you not access to perform this action")
        return current_user
    return role_Check