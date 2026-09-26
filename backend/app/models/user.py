from app.core.database import Base
from sqlalchemy import Column,String,Integer,DateTime
from sqlalchemy.orm import relationship
from datetime import datetime


class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True)
    name=Column(String,nullable=False)
    email=Column(String,unique=True,nullable=False)
    password=Column(String,nullable=False)
    created_at=Column(DateTime,default=datetime.now)
    updated_at=Column(DateTime,default=datetime.now,onupdate=datetime.now)
    
    userrole=relationship("UserRole",back_populates="user")