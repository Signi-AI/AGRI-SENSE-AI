from app.core.database import Base
from sqlalchemy import Column,String,Integer,DateTime
from datetime import datetime

class Revoke(Base):
    __tablename__="revokes"
    id=Column(Integer,primary_key=True)
    token=Column(String)
    user_id=Column(Integer)
    revoked_at=Column(DateTime,default=datetime.now)