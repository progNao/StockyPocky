# Test用
from app.models.stock import Stock
from app.models.user import User
from app.repositories.test.test_repo import test_create_stock
from app.schemas.stock import StockRequest, StockResponse
from sqlalchemy.orm import Session
from app.utils.response import error, success


def create_stock_test_api(item_id: int, request: StockRequest, db: Session, current_user: User):
  new_stock = Stock(
    quantity=request.quantity,
    threshold=request.threshold,
    location=request.location,
    user_id=current_user.id,
    item_id=item_id
  )
  
  try:
    test_create_stock(new_stock, db)
    return success(StockResponse.model_validate(new_stock))
  except Exception:
    db.rollback()
    return error("db_error", 500)