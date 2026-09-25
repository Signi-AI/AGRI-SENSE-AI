from app.core.database import Base
from sqlalchemy import Column,Integer,ForeignKey,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class UserRole(Base):
    __tablename__="userroles"
    
    id=Column(Integer,primary_key=True)
    role_id=Column(Integer,ForeignKey("roles.id"))
    user_id=Column(Integer,ForeignKey("users.id"))
    created_at=Column(DateTime,default=datetime.now)
    updated_at=Column(DateTime,default=datetime.now,onupdate=datetime.now)
    
    
    user=relationship("User",back_populates="userrole")
    role=relationship("Role",back_populates="userRoles")
