from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_role
from app.models.user import User
from app.services.seed_role import seed

router = APIRouter(tags=["SeedRole"])
admin_required = require_role("admin")


@router.post("/roles")
def seedrole(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return seed(db)
