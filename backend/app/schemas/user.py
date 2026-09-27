from pydantic import BaseModel,EmailStr
from typing import Optional,List
from datetime import datetime



class UserCreate(BaseModel):
    name:str
    email:EmailStr
    password:str
    

class UserUpdate(BaseModel):
    name:Optional[str]=None
    email:Optional[EmailStr]=None


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
    
