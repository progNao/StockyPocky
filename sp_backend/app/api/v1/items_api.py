from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models.item import Item
from app.models.stock_history import StockHistory
from app.models.user import User
from app.repositories.items_repo import create_item, delete_item, get_items, get_items_by_id, update_item
from app.repositories.stock_history_repo import create_stock_history, get_stock_history_by_item_id
from app.repositories.stocks_repo import get_stock_by_item_id, update_stock
from app.schemas.item import ItemRequest, ItemResponse
from app.schemas.stock import StockRequest, StockResponse
from app.schemas.stock_history import StockHistoryRequest, StockHistoryResponse
from app.utils.response import error, success

def get_items_api(category_id: int, is_favorite: bool, db: Session, current_user: User):
  items = get_items(current_user.id, category_id, is_favorite, db)
  response = [ItemResponse.model_validate(c) for c in items]
  return success(response)

def get_item_api(item_id: int, db: Session):
  item = __private_item_check(item_id, db)
  
  if isinstance(item, JSONResponse):
    return item
  
  return success(ItemResponse.model_validate(item))

def create_item_api(request: ItemRequest, db: Session, current_user: User):
  new_item = Item(
    name=request.name,
    brand=request.brand,
    unit=request.unit,
    image_url=request.image_url,
    default_quantity=request.default_quantity,
    notes=request.notes,
    is_favorite=request.is_favorite,
    user_id=current_user.id,
    category_id=request.category_id
  )
  
  try:
    create_item(new_item, db)
    return success(ItemResponse.model_validate(new_item))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def update_item_api(item_id: int, request: ItemRequest, db: Session):
  item = __private_item_check(item_id, db)

  if isinstance(item, JSONResponse):
    return item
  
  if request.name:
    item.name = request.name
  if request.brand:
    item.brand = request.brand
  if request.unit:
    item.unit = request.unit
  if request.image_url:
    item.image_url = request.image_url
  if request.default_quantity:
    item.default_quantity = request.default_quantity
  if request.notes:
    item.notes = request.notes
  if request.is_favorite:
    item.is_favorite = request.is_favorite
  
  try:
    response = update_item(item, db)
    return success(ItemResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def delete_item_api(item_id: int, db: Session):
  item = __private_item_check(item_id, db)
  
  if isinstance(item, JSONResponse):
    return item
  
  try:
    delete_item(item, db)
    return success(ItemResponse.model_validate(item))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def get_stock_by_item_id_api(item_id: int, db: Session):
  stock = __private_stock_check(item_id, db)
  
  if isinstance(stock, JSONResponse):
    return stock
  
  return success(StockResponse.model_validate(stock))

def update_stock_api(item_id: int, request: StockRequest, db: Session):
  stock = __private_stock_check(item_id, db)

  if isinstance(stock, JSONResponse):
    return stock
  
  if request.quantity:
    stock.quantity = request.quantity
  if request.threshold:
    stock.threshold = request.threshold
  if request.location:
    stock.location = request.location
  
  try:
    response = update_stock(stock, db)
    return success(StockResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def get_stock_history_by_item_id_api(item_id: int, db: Session):
  stock_history = __private_stock_history_check(item_id, db)
  
  if isinstance(stock_history, JSONResponse):
    return stock_history
  
  response = [StockHistoryResponse.model_validate(c) for c in stock_history]
  return success(response)

def create_stock_history_api(item_id: int, request: StockHistoryRequest, db: Session, current_user: User):
  new_stock_history = StockHistory(
    change=request.change,
    reason=request.reason,
    memo=request.memo,
    user_id=current_user.id,
    item_id=item_id
  )
  
  try:
    create_stock_history(new_stock_history, db)
    return success(StockHistoryResponse.model_validate(new_stock_history))
  except Exception:
    db.rollback()
    return error("db_error", 500)
  
# private

def __private_item_check(item_id: int, db: Session):
  item = get_items_by_id(item_id, db)
  
  if not item:
    return error("Item not found", 404)
  else:
    return item

def __private_stock_check(item_id: int, db: Session):
  stock = get_stock_by_item_id(item_id, db)
  
  if not stock:
    return error("Stock not found", 404)
  else:
    return stock

def __private_stock_history_check(item_id: int, db: Session):
  stock_history = get_stock_history_by_item_id(item_id, db)
  
  if not stock_history:
    return error("StockHistory not found", 404)
  else:
    return stock_history