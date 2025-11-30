from sqlalchemy.orm import Session
from app.models.stock_history import StockHistory

def get_stock_history_by_item_id(item_id: int, db: Session):
  return db.query(StockHistory).filter(StockHistory.item_id == item_id).all()

def create_stock_history(request: StockHistory, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

# private

def __private_db_change(data: StockHistory, db: Session):
  db.commit()
  db.refresh(data)