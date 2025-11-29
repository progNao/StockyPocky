from sqlalchemy.orm import Session
from app.models.user import User
from app.repositories.stocks_repo import get_stocks
from app.schemas.stock import StockResponse
from app.utils.response import success

def get_stocks_api(db: Session, current_user: User):
  stocks = get_stocks(current_user.id, db)
  response = [StockResponse.model_validate(c) for c in stocks]
  return success(response)