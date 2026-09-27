from app.services.user_service import UserService
from fastapi import APIRouter,Depends,Query
from app.schemas.user import UserUpdate,UserResponse,PaginationResponse
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.database import get_db
from typing import List
from app.core.dependencies import get_current_user,require_role

admin_required=require_role("admin")
farmer_required=require_role(["farmer","agromist"])


router=APIRouter(prefix="/user",tags=["User"])


@router.get("",response_model=UserResponse)
def myinfo(db:Session=Depends(get_db),current_user:User=Depends(farmer_required)):
    return UserService.myinfo(db,current_user)

@router.get("/all",response_model=PaginationResponse)
def show_all_user(db:Session=Depends(get_db),current_user:User=Depends(admin_required),
                  page:int=Query(1,ge=1),limit:int=Query(10,ge=10 ,le=100),
                search:str=None,sort:str=None,order="desc"
                ):
    return UserService.alluser(db,page,limit,search,sort,order)


@router.get("/{user_id}",response_model=UserResponse,)
def showbyid(user_id:int,db:Session=Depends(get_db),
             current_user:User=Depends(farmer_required)):
    return UserService.singleiser(db,user_id)

@router.put("/user_id",response_model=UserResponse)
def update(user_id:int,data:UserUpdate,db:Session=Depends(get_db),
           current_user:User=Depends(farmer_required)):
    return UserService.userupdate(db,data,user_id,current_user)

@router.delete("/delete/{user_id}")
def deleteinfo(user_id:int,db:Session=Depends(get_db),
               current_user:User=Depends(farmer_required)):
    return UserService.deleteuser(user_id,db,current_user)

@router.patch("/changepassword")
def changepasword(old_password,new_password,
                  current_user:User=Depends(get_current_user),
                  db:Session=Depends(get_db)):
    return UserService.changepassword(db,current_user,old_password,new_password)

