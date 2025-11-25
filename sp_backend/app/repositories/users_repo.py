from uuid import UUID
from sqlalchemy.orm import Session
from app.models.user import User

def get_users(db: Session):
  return db.query(User).all()

def get_user(user_id: UUID, db: Session):
  return db.query(User).filter(User.id == user_id).first()

def get_user_for_name(request: User, db: Session):
  return db.query(User).filter(User.name == request.name).first()

def get_user_for_name_only(name: str, db: Session):
  return db.query(User).filter(User.name == name).first()

def get_user_for_email(request: User, db: Session):
  return db.query(User).filter(User.email == request.email).first()

def get_user_for_name_check(request: User, db: Session):
  return db.query(User).filter(User.name == request.name, User.id != request.id).first()

def get_user_for_email_check(request: User, db: Session):
  return db.query(User).filter(User.email == request.email, User.id != request.id).first()

def create_user(request: User, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_user(request: User, db: Session):
  __private_db_change(request, db)
  return request

def delete_user(request: User, db: Session):
  db.delete(request)
  db.commit()
  return request

# private

def __private_db_change(data: User, db: Session):
  db.commit()
  db.refresh(data)