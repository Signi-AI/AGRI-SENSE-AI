from app.core.audit import log_security
from app.models.role import Role
from app.models.user import User
from app.models.userRole import UserRole
from sqlalchemy.orm import Session


roles=[
    {"name":"farmer"},
    {"name":"agromist"},
    {"name":"admin"}
]


def seed(db:Session):
    """Create only the roles that are missing. Safe to call repeatedly."""
    existing_names={row.name for row in db.query(Role).all()}
    created=[]

    for data in roles:
        if data["name"] in existing_names:
            continue
        db.add(Role(name=data["name"]))
        created.append(data["name"])

    if created:
        db.commit()

    return {
        "message":"roles seeded successfully",
        "created":created,
        "existing":sorted(existing_names),
    }


def normalize_legacy_admins(db: Session, allowed_emails: str = "") -> dict:
    """Downgrade old accounts that were all created with the admin role.

    Only emails listed in ADMIN_EMAILS (comma separated) keep admin access.
    Everyone else is moved to farmer so old signups cannot read user lists.
    """
    allowed = {
        item.strip().lower()
        for item in (allowed_emails or "").split(",")
        if item.strip()
    }
    admin_role = db.query(Role).filter(Role.name == "admin").first()
    farmer_role = db.query(Role).filter(Role.name == "farmer").first()
    if not admin_role or not farmer_role:
        return {"downgraded": 0}

    downgraded = 0
    links = db.query(UserRole).filter(UserRole.role_id == admin_role.id).all()
    for link in links:
        user = db.query(User).filter(User.id == link.user_id).first()
        if not user or user.email.strip().lower() in allowed:
            continue

        db.delete(link)
        has_farmer = (
            db.query(UserRole)
            .filter(UserRole.user_id == user.id, UserRole.role_id == farmer_role.id)
            .first()
        )
        if not has_farmer:
            db.add(UserRole(user_id=user.id, role_id=farmer_role.id))
        log_security("legacy_admin_downgraded", ip="", email=user.email, user_id=user.id)
        downgraded += 1

    if downgraded:
        db.commit()
    return {"downgraded": downgraded}
