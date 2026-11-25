from sqlalchemy import create_engine
from sqlalchemy.engine import make_url
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


SQLAKCHEMY_URL=settings.DATABASE_URL

# Neon (and other hosted Postgres providers) drop idle connections. Pre-pinging
# prevents a stale pooled connection from breaking the first request after an
# idle period, and recycle keeps the pool fresh.
url=make_url(SQLAKCHEMY_URL)
is_postgres=url.get_backend_name()=="postgresql"
connect_args={}

if is_postgres and not url.query.get("sslmode"):
    # Neon requires TLS. If the URL already specifies sslmode, keep that value.
    connect_args["sslmode"]="require"

engine_options={
    "connect_args":connect_args,
    "pool_pre_ping":True,
    "pool_recycle":1800,
}

if is_postgres:
    engine_options["pool_size"]=5
    engine_options["max_overflow"]=10

engine=create_engine(SQLAKCHEMY_URL,**engine_options)

sessionLocal=sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base=declarative_base()

def get_db():
    db=sessionLocal()
    try:
        yield db
    finally:
        db.close()
        