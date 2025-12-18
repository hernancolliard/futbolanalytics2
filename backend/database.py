import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.exc import NoSuchModuleError
from sqlalchemy.orm import sessionmaker, declarative_base

DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    raise RuntimeError("DATABASE_URL is not set")

# Normalizar URL de Postgres: si el esquema es 'postgresql://' o 'postgres://'
# y no especifica un driver (+...), forzamos psycopg2 para evitar que SQLAlchemy
# intente cargar 'postgresql.psycopg' cuando ese driver no esté disponible.
db_url_normalized = DB_URL
if DB_URL.startswith("postgresql://") or DB_URL.startswith("postgres://"):
    # Si no se especifica driver, preferimos psycopg2 (psycopg2-binary).
    if "+" not in DB_URL.split("://", 1)[1]:
        db_url_normalized = DB_URL.replace("postgresql://", "postgresql+psycopg2://", 1) if DB_URL.startswith("postgresql://") else DB_URL.replace("postgres://", "postgresql+psycopg2://", 1)
    # Si la URL explícitamente pide psycopg (psycopg3) y el entorno no tiene
    # ese driver, vamos a intentar caer de vuelta a psycopg2 más abajo.


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
    try:
        engine = create_engine(
            db_url_normalized,
            pool_size=5,
            max_overflow=10,
            **engine_kwargs
        )
    except NoSuchModuleError as e:
        # Si SQLAlchemy intenta cargar `postgresql.psycopg` y no está
        # disponible en el entorno, hacemos un intento de recuperación
        # reemplazando '+psycopg' por '+psycopg2' y reintentando.
        logging.warning("NoSuchModuleError while creating engine: %s", e)
        if "+psycopg" in db_url_normalized:
            fallback = db_url_normalized.replace("+psycopg", "+psycopg2")
            logging.info("Reintentando con URL de fallback: %s", fallback)
            engine = create_engine(
                fallback,
                pool_size=5,
                max_overflow=10,
                **engine_kwargs
            )
        else:
            # No es un case de psycopg específico, propaga el error.
            raise

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
