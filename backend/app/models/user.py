from app.core.database import Base
from sqlalchemy import Boolean,Column,String,Integer,DateTime
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

    # Security fields
    is_verified=Column(Boolean,default=False,nullable=False)
    token_version=Column(Integer,default=0,nullable=False)
    failed_login_attempts=Column(Integer,default=0,nullable=False)
    locked_until=Column(DateTime,nullable=True)

    userrole=relationship("UserRole",back_populates="user")
