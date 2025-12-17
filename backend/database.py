import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise RuntimeError("DATABASE_URL is not set")

engine = create_engine(
    DB_URL,
    future=True,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()


# -------------------------------------------------
# DB SESSION DEPENDENCY
# -------------------------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------------------------------------
# INIT DB (NO usar automáticamente en producción)
# -------------------------------------------------

def init_db():
    import models  # importa todos los modelos
    Base.metadata.create_all(bind=engine)
