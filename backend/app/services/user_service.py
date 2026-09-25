from sqlalchemy.orm import Session
from app.models.user import User
from app.models.role import Role
from fastapi import HTTPException,status,Query
from app.schemas.user import UserUpdate
from app.core.security import Hash
from sqlalchemy import  desc,asc
import math

class UserService:
    
    @staticmethod
    def myinfo(db:Session,current_user):
        user=db.query(User).filter(User.id==current_user.id).first()
        return user
    
    @staticmethod
    def alluser(db:Session,page:int=Query(1,ge=1),limit:int=Query(10,ge=10 ,le=100),
                search:str=None,sort:str=None,order="desc"
                ):
        user=db.query(User)
        if search:
            user=user.filter(User.name.ilike(f"%{search}%"))
        if  sort:
            if sort=="name":
                user=user.order_by(asc(User.name)) 
            else:
                user=user.order_by(desc(User.name))
        else:
            if sort=="created_at":
                user=user.order_by(asc(User.created_at))
            else:
                user=user.order_by(desc(User.created_at))
        skip=(page-1)*limit
        
        total=user.count()
        total_pages=math.ceil(total/limit)
        user=user.offset(skip).limit(limit).all()        
                       
            
        return {
            "page":page,
            "limit":limit,
            "total_user":total,
            "total_pages":total_pages,
            "users":user
        }
        
    @staticmethod
    def singleiser(db:Session,user_id:int):
        user=db.query(User).filter(User.id==user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found")
        return user
    
    @staticmethod
    def userupdate(db:Session,data:UserUpdate,user_id:int,current_user):
        user=db.query(User).filter(User.id==user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found")
        roles=[ur.role.name for ur in current_user.userrole]
        if "admin" in roles:
            pass
        if user.id != current_user.id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="access denied")
        
        user.email=data.email,
        user.name=data.name
        
        db.commit()
        db.user(user)
        return user        
    
    
    @staticmethod
    def deleteuser(user_id:int,db:Session,current_user):
        user=db.query(User).filter(User.id==user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="user not found")
        roles=[ur.role.name for ur in current_user.userrole]
        if "admin" in roles:
            pass
        elif current_user.id != user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="access denied")
                
        db.delete(user)
        db.commit()
        return {
            "message":"user delete succesfuly"
        }    
        
    
    @staticmethod
    def changepassword(db:Session,current_user,old_passwod:str,new_password:str):
        user=db.query(User).filter(User.id==current_user.id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="access denied")
        if not Hash.verify_password(old_passwod,user.password):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="wrong old password")
        if old_passwod==new_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="these two password must be different")
        user.password=Hash.password_hash(new_password)
        
        db.commit()
        db.refresh(user)
        return {
            "message":"""succesfuly password changed✅,
            please refresh and login again with new password!!!!"""
            
        }
            
                   