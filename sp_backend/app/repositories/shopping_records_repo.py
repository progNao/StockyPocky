from uuid import UUID
from sqlalchemy.orm import Session
from app.models.shopping_record import ShoppingRecord

def get_shopping_records(user_id: UUID, db: Session):
  return db.query(ShoppingRecord).filter(ShoppingRecord.user_id == user_id).all()

def get_shopping_record_by_id(shopping_record_id: int, db: Session):
  return db.query(ShoppingRecord).filter(ShoppingRecord.id == shopping_record_id).first()

def create_shopping_record(request: ShoppingRecord, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_shopping_record(request: ShoppingRecord, db: Session):
  __private_db_change(request, db)
  return request

def delete_shopping_record(request: ShoppingRecord, db: Session):
  db.delete(request)
  db.commit()
  return request

# private

def __private_db_change(data: ShoppingRecord, db: Session):
  db.commit()
  db.refresh(data)