from typing import Any
from uuid import UUID
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import LoginRequest, SignupRequest, UpdateUserRequest

def get_users(db: Session):
  return db.query(User).all()

def get_user(payload: UUID, db: Session):
  return db.query(User).filter(User.id == payload).first()

def get_user_for_name(payload: LoginRequest, db: Session):
  return db.query(User).filter(User.name == payload.name).first()

def get_user_for_name_only(name: str, db: Session):
  return db.query(User).filter(User.name == name).first()

def get_user_for_email(payload: LoginRequest, db: Session):
  return db.query(User).filter(User.email == payload.email).first()

def create_user(payload: SignupRequest, db: Session):
  db.add(payload)
  __private_db_change(payload, db)
  return payload

def update_user(payload: Any, db: Session):
  __private_db_change(payload, db)
  return payload

def delete_user(payload: Any, db: Session):
  db.delete(payload)
  db.commit()
  return payload

def __private_db_change(data: Any, db: Session):
  db.commit()
  db.refresh(data)