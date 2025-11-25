from sqlalchemy.orm import Session
from app.models.category import Category

def get_categories(db: Session):
  return db.query(Category).all()

def get_category_by_id(category_id: int, db: Session):
  return db.query(Category).filter(Category.id == category_id).first()

def create_category(request: Category, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_category(request: Category, db: Session):
  __private_db_change(request, db)
  return request

def delete_category(request: Category, db: Session):
  db.delete(request)
  db.commit()
  return request

# private

def __private_db_change(data: Category, db: Session):
  db.commit()
  db.refresh(data)