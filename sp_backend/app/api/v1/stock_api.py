from sqlalchemy.orm import Session
from app.models.stock import Stock
from app.models.user import User
from app.repositories.stocks_repo import create_stock, get_stocks
from app.schemas.stock import StockOnlyRequest, StockResponse
from app.utils.response import error, success

def get_stocks_api(db: Session, current_user: User):
  stocks = get_stocks(current_user.id, db)
  response = [StockResponse.model_validate(c) for c in stocks]
  return success(response)

def create_stock_api(request: StockOnlyRequest, db: Session, current_user: User):
  new_stock = Stock(
    quantity=request.quantity,
    threshold=request.threshold,
    location=request.location,
    user_id=current_user.id,
    item_id=request.item_id
  )
  
  try:
    create_stock(new_stock, db)
    return success(StockResponse.model_validate(new_stock))
  except Exception:
    db.rollback()
    return error("db_error", 500)