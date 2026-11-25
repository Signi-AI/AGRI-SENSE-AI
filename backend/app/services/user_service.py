import math

from fastapi import HTTPException, status
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.core.audit import log_security
from app.core.security import Hash
from app.models.revoke import Revoke
from app.models.user import User
from app.schemas.user import ChangePassword, UserUpdate


def _is_admin(current_user) -> bool:
    return any(ur.role.name == "admin" for ur in current_user.userrole)


def _can_access(current_user, user_id: int) -> bool:
    return _is_admin(current_user) or current_user.id == user_id


class UserService:

    @staticmethod
    def myinfo(db: Session, current_user):
        return db.query(User).filter(User.id == current_user.id).first()

    @staticmethod
    def alluser(db: Session, page: int = 1, limit: int = 10,
                search: str = None, sort: str = None, order: str = "desc"):
        query = db.query(User)
        if search:
            query = query.filter(User.name.ilike(f"%{search[:100]}%"))
        if sort == "name":
            query = query.order_by(asc(User.name))
        elif sort == "created_at":
            query = query.order_by(asc(User.created_at))
        else:
            query = query.order_by(desc(User.created_at))

        total = query.count()
        users = query.offset((page - 1) * limit).limit(limit).all()
        return {
            "page": page,
            "limit": limit,
            "total_user": total,
            "total_pages": math.ceil(total / limit),
            "users": users,
        }

    @staticmethod
    def singleiser(db: Session, user_id: int, current_user):
        if not _can_access(current_user, user_id):
            log_security("user_read_denied", ip="", user_id=current_user.id, target=user_id)
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="access denied")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
        return user

    @staticmethod
    def userupdate(db: Session, data: UserUpdate, user_id: int, current_user):
        if not _can_access(current_user, user_id):
            log_security("user_update_denied", ip="", user_id=current_user.id, target=user_id)
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="access denied")

        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")

        if data.name is not None:
            user.name = data.name.strip()
        if data.email is not None and data.email.strip().lower() != user.email:
            email = data.email.strip().lower()
            if db.query(User).filter(User.email == email, User.id != user.id).first():
                raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="email already in use")
            user.email = email

        db.commit()
        db.refresh(user)
        log_security("user_updated", ip="", user_id=current_user.id, target=user_id)
        return user

    @staticmethod
    def deleteuser(user_id: int, db: Session, current_user):
        if not _can_access(current_user, user_id):
            log_security("user_delete_denied", ip="", user_id=current_user.id, target=user_id)
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="access denied")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")

        db.delete(user)
        db.commit()
        log_security("user_deleted", ip="", user_id=current_user.id, target=user_id)
        return {"message": "user delete succesfuly"}

    @staticmethod
    def changepassword(db: Session, current_user, data: ChangePassword):
        user = db.query(User).filter(User.id == current_user.id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="access denied")
        if not Hash.verify_password(data.current_password, user.password):
            log_security("password_change_failed", ip="", user_id=user.id)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="wrong old password")
        if data.current_password == data.new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="these two password must be different",
            )

        user.password = Hash.password_hash(data.new_password)
        user.token_version += 1
        db.query(Revoke).filter(Revoke.user_id == user.id).delete()
        db.commit()
        log_security("password_changed", ip="", user_id=user.id)
        return {"message": "Password changed. Please sign in again."}
