import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.exc import NoSuchModuleError
from sqlalchemy.orm import sessionmaker, declarative_base

DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise RuntimeError("DATABASE_URL is not set")

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
# ...
# Normalizar URL de Postgres para forzar el uso de psycopg2
try:
    db_url_parsed = URL.create(DB_URL)
    if db_url_parsed.drivername.startswith("postgresql"):
        db_url_parsed = db_url_parsed.set(drivername="postgresql+psycopg2")
    db_url_normalized = db_url_parsed
except Exception as e:
    logging.error(f"Could not parse and normalize DB_URL: {e}")
    # Fallback to old method just in case
    db_url_normalized = DB_URL
    if db_url_normalized.startswith("postgres://"):
        db_url_normalized = db_url_normalized.replace("postgres://", "postgresql+psycopg2://", 1)
    elif db_url_normalized.startswith("postgresql://"):
        db_url_normalized = db_url_normalized.replace("postgresql://", "postgresql+psycopg2://", 1)


# Ajustar opciones de engine según el dialecto. SQLite no acepta
# pool_size / max_overflow en combinación con algunos tipos de pool,
# así que sólo los aplicamos para otros motores (Postgres, etc.).
engine_kwargs = {
    "future": True,
    "pool_pre_ping": True,
}

if DB_URL.startswith("sqlite"):
    # Para SQLite (archivo o memory) deshabilitamos check_same_thread
    # si es necesario y no pasamos pool_size/max_overflow.
    connect_args = {"check_same_thread": False}
    engine = create_engine(DB_URL, connect_args=connect_args, **engine_kwargs)
else:
    # Para otros motores (Postgres/MySQL) podemos usar tamaño de pool.
    logging.warning(f"DB_URL: {DB_URL}")
    logging.warning(f"db_url_normalized: {db_url_normalized}")
    engine = create_engine(
        db_url_normalized,
        pool_size=5,
        max_overflow=10,
        **engine_kwargs
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
