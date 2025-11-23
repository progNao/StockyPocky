from sqlalchemy.orm import Session
from models.user import User
from schemas.user import LoginRequest, SignupRequest

def get_users(db: Session):
  return db.query(User).all()

def get_user_for_name(payload: LoginRequest, db: Session):
  return db.query(User).filter(User.name == payload.name).first()

def get_user_for_email(payload: LoginRequest, db: Session):
  return db.query(User).filter(User.email == payload.email).first()

def create_user(payload: SignupRequest, db: Session):
  db.add(payload)
  db.commit()
  db.refresh(payload)
  return payload
