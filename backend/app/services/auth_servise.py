from app.schemas.user import UserCreate
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from app.models.userRole import UserRole
from fastapi import HTTPException,status
from app.models.revoke import Revoke
from app.core.security import Hash,create_access_token




class AuthServise():
    
    @staticmethod
    def registeruser(data:UserCreate,db:Session):
        existinguser=db.query(User).filter(User.email==data.email).first()
        if existinguser:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="user email already exist")
        role=db.query(Role).filter(Role.name=="admin").first()
        user=User(
            name=data.name,
            password=Hash.password_hash(data.password),
            email=data.email
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        roleuser=UserRole(
            user_id=user.id,
            role_id=role.id
        )
        db.add(roleuser)
        db.commit()
        
        return user
    
    @staticmethod
    def loginuser(db:Session,email:str,password:str):
        user=db.query(User).filter(User.email==email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="wrong email or passord")
        if not (Hash.verify_password(password,user.password)):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="wrong email or pasword")
        token=create_access_token({"sub":user.email})
        
        return{
            "access_token":token,
            "token_type":"Bearer"
        }        
        
    @staticmethod
    def logout(token:str,db:Session,current_user):
        revoked=db.query(Revoke).filter(Revoke.token==token).first()
        if revoked:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="already logged out,please login again")
        revoke=db.query(Revoke).filter(Revoke.user_id==current_user.id).first()
        if revoke:
            revoke.token==token
        else:
            revoke=Revoke(
                token=token,
                user_id=current_user.id
            )
            db.add(revoke)
        db.commit()
        db.refresh(revoke)   
        return {
            "message":"logout successful"
        }