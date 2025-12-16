from uuid import UUID
from sqlalchemy.orm import Session
from app.models.stock import Stock

def get_stocks(user_id: UUID, db: Session):
  return db.query(Stock).filter(Stock.user_id == user_id).all()

def get_stock_by_item_id(item_id: int, db: Session):
  return db.query(Stock).filter(Stock.item_id == item_id).first()

def create_stock(request: Stock, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_stock(request: Stock, db: Session):
  __private_db_change(request, db)
  return request

# private

def __private_db_change(data: Stock, db: Session):
  db.commit()
  db.refresh(data)