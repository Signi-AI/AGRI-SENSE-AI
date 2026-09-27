from app.models.role import Role
from sqlalchemy.orm import Session
from fastapi import HTTPException,status



roles=[
    {"name":"farmer"},
    {"name":"agromist"},
    {"name":"admin"}
]
def seed(db:Session):
    for data in roles:
        existing=db.query(Role).filter(Role.name==data["name"]).all()
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="roles already created successfuly")
        role=Role(
            name=data["name"]
        )
        db.add(role)
        
    db.commit()
    db.refresh(role)
    
    return {
        "message":"roles seeded succesfuly"
    }