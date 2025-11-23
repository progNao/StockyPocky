import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Engine 作成
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

# SessionLocal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base for models（既にテーブル作成済みでも必要）
Base = declarative_base()


# FastAPI の dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()