from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_role
from app.models.user import User
from app.schemas.user import ChangePassword, PaginationResponse, UserResponse, UserUpdate
from app.services.user_service import UserService

admin_required = require_role("admin")
farmer_required = require_role(["farmer", "agromist"])

router = APIRouter(prefix="/user", tags=["User"])


@router.get("", response_model=UserResponse)
def myinfo(db: Session = Depends(get_db), current_user: User = Depends(farmer_required)):
    return UserService.myinfo(db, current_user)


@router.get("/all", response_model=PaginationResponse)
def show_all_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None, max_length=100),
    sort: str = Query(None, max_length=30),
    order: str = Query("desc", max_length=10),
):
    return UserService.alluser(db, page, limit, search, sort, order)


@router.get("/{user_id}", response_model=UserResponse)
def showbyid(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(farmer_required),
):
    return UserService.singleiser(db, user_id, current_user)


@router.put("/{user_id}", response_model=UserResponse)
def update(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(farmer_required),
):
    return UserService.userupdate(db, data, user_id, current_user)


@router.delete("/delete/{user_id}")
def deleteinfo(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(farmer_required),
):
    return UserService.deleteuser(user_id, db, current_user)


@router.patch("/changepassword")
def changepasword(
    data: ChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return UserService.changepassword(db, current_user, data)
