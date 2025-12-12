import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from urllib.parse import quote_plus
from dotenv import load_dotenv


load_dotenv()
DB_URL = os.getenv('DATABASE_URL')


# SQLAlchemy engine
engine = create_engine(DB_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


# helper
def get_db():
    db = SessionLocal()
    try:
      yield db
    finally:
      db.close()