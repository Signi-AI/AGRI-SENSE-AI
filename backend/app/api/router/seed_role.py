from app.services.seed_role import seed
from fastapi import APIRouter,Depends
from app.core.database import get_db
from sqlalchemy.orm import Session


router=APIRouter(tags=["SeedRole"])

@router.post("/roles")
def seedrole(db:Session=Depends(get_db)):
    return seed(db)


