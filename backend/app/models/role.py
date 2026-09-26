from app.core.database import Base
from sqlalchemy import Column,String,Integer,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class Role(Base):
    __tablename__="roles"
    
    id=Column(Integer,primary_key=True)
    name=Column(String,nullable=False)
    created_at=Column(DateTime,default=datetime.now)
    
    userRoles=relationship("UserRole",back_populates="role")