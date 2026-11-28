"""Delete every user and the rows that belong to them.

Run from the backend folder so .env is loaded:

    .venv/bin/python scripts/clear_users.py --yes

The command is deliberately destructive and requires --yes. Roles (farmer,
agromist, admin) are kept, so the next signup can be assigned a role normally.
Raw table names are used so this also works on an older local database that
has not had the latest migration applied yet.
"""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text

from app.core.database import engine, sessionLocal


TABLES = ("users", "userroles", "revokes")


def main() -> int:
    parser = argparse.ArgumentParser(description="Empty the AgriSense user tables")
    parser.add_argument(
        "--yes",
        action="store_true",
        help="required confirmation that all users should be deleted",
    )
    args = parser.parse_args()

    if not args.yes:
        print("Nothing deleted. Re-run with --yes to confirm the deletion.")
        return 1

    db = sessionLocal()
    try:
        counts = {
            table: db.execute(text(f"SELECT count(*) FROM {table}")).scalar()
            for table in TABLES
        }

        # Children first, so foreign keys never point at a missing user.
        for table in ("revokes", "userroles", "users"):
            db.execute(text(f"DELETE FROM {table}"))
        db.commit()

        if engine.dialect.name == "sqlite":
            sequence = db.execute(
                text(
                    "SELECT name FROM sqlite_master "
                    "WHERE type='table' AND name='sqlite_sequence'"
                )
            ).first()
            if sequence:
                names = ", ".join(f"'{table}'" for table in TABLES)
                db.execute(
                    text(f"DELETE FROM sqlite_sequence WHERE name IN ({names})")
                )
        elif engine.dialect.name == "postgresql":
            db.execute(
                text(
                    "TRUNCATE TABLE users, userroles, revokes "
                    "RESTART IDENTITY CASCADE"
                )
            )
        db.commit()

        remaining = db.execute(text("SELECT count(*) FROM users")).scalar()
        print("Deleted rows:", counts)
        print("Remaining users:", remaining)
        print("Roles kept; new signups get farmer, or admin if listed in ADMIN_EMAILS.")
    finally:
        db.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
