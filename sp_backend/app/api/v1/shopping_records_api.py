from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models.shopping_record import ShoppingRecord
from app.models.user import User
from app.repositories.shopping_records_repo import create_shopping_record, delete_shopping_record, get_monthly_spending, get_shopping_record_by_id, get_shopping_records, get_spending_by_category, get_spending_by_item, update_shopping_record
from app.schemas.shopping_record import ShoppingRecordRequest, ShoppingRecordResponse
from app.utils.response import error, success

def get_shopping_records_api(db: Session, current_user: User):
  shopping_records = get_shopping_records(current_user.id, db)
  response = [ShoppingRecordResponse.model_validate(c) for c in shopping_records]
  return success(response)

def get_shopping_record_api(shopping_record_id: int, db: Session):
  shopping_record = __private_shopping_record_check(shopping_record_id, db)
  
  if isinstance(shopping_record, JSONResponse):
    return shopping_record
  
  return success(ShoppingRecordResponse.model_validate(shopping_record))

def create_shopping_record_api(request: ShoppingRecordRequest, db: Session, current_user: User):
  new_shopping_record = ShoppingRecord(
    item_id=request.item_id,
    quantity=request.quantity,
    price=request.price,
    store=request.store,
    bought_at=request.bought_at,
    user_id=current_user.id
  )

  try:
    create_shopping_record(new_shopping_record, db)
    return success(ShoppingRecordResponse.model_validate(new_shopping_record))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def update_shopping_record_api(shopping_record_id: int, request: ShoppingRecordRequest, db: Session):
  shopping_record = __private_shopping_record_check(shopping_record_id, db)
  
  if isinstance(shopping_record, JSONResponse):
    return shopping_record

  if request.item_id:
    shopping_record.item_id = request.item_id
  if request.quantity:
    shopping_record.quantity = request.quantity
  if request.price:
    shopping_record.price = request.price
  if request.store:
    shopping_record.store = request.store
  if request.bought_at:
    shopping_record.bought_at = request.bought_at
    
  try:
    response = update_shopping_record(shopping_record, db)
    return success(ShoppingRecordResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def delete_shopping_record_api(shopping_record_id: int, db: Session):
  shopping_record = __private_shopping_record_check(shopping_record_id, db)
  
  if isinstance(shopping_record, JSONResponse):
    return shopping_record
  
  try:
    delete_shopping_record(shopping_record, db)
    return success(ShoppingRecordResponse.model_validate(shopping_record))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def get_monthly_spending_api(db: Session, current_user: User):
  try:
    data = get_monthly_spending(current_user.id, db)
    return success([dict(row._mapping) for row in data])
  except Exception:
    db.rollback()
    return error("db_error", 500)

def get_spending_by_item_api(db: Session, current_user: User):
  try:
    data = get_spending_by_item(current_user.id, db)
    return success([dict(row._mapping) for row in data])
  except Exception:
    db.rollback()
    return error("db_error", 500)

def get_spending_by_category_api(db: Session, current_user: User):
  try:
    data = get_spending_by_category(current_user.id, db)
    return success([dict(row._mapping) for row in data])
  except Exception:
    db.rollback()
    return error("db_error", 500)

# private

def __private_shopping_record_check(shopping_record_id: int, db: Session):
  shopping_record = get_shopping_record_by_id(shopping_record_id, db)
  
  if not shopping_record:
    return error("ShoppingRecord not found", 404)
  else:
    return shopping_record