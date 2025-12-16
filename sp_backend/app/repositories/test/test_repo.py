# Test用
from app.models.stock import Stock
from sqlalchemy.orm import Session

def test_create_stock(request: Stock, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

# Private

def __private_db_change(data: Stock, db: Session):
  db.commit()
  db.refresh(data)