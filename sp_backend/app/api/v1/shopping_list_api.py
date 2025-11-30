from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models.shopping_list import ShoppingList
from app.models.user import User
from app.repositories.shopping_list_repo import create_shopping_list, delete_shopping_list, get_shopping_list_by_id, get_shopping_lists, update_shopping_list
from app.schemas.shopping_list import ShoppingListCheckRequest, ShoppingListRequest, ShoppingListResponse
from app.utils.response import error, success

def get_shopping_lists_api(db: Session, current_user: User):
  shopping_lists = get_shopping_lists(current_user.id, db)
  response = [ShoppingListResponse.model_validate(c) for c in shopping_lists]
  return success(response)

def get_shopping_list_api(shopping_list_id: int, db: Session):
  shopping_list = __private_shopping_list_check(shopping_list_id, db)
  
  if isinstance(shopping_list, JSONResponse):
    return shopping_list
  
  return success(ShoppingListResponse.model_validate(shopping_list))

def create_shopping_list_api(request: ShoppingListRequest, db: Session, current_user: User):
  new_shopping_list = ShoppingList(
    quantity=request.quantity,
    checked=False,
    user_id=current_user.id,
    item_id=request.item_id
  )
  
  try:
    create_shopping_list(new_shopping_list, db)
    return success(ShoppingListResponse.model_validate(new_shopping_list))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def update_shopping_list_api(shopping_list_id: int, request: ShoppingListCheckRequest, db: Session):
  shopping_list = __private_shopping_list_check(shopping_list_id, db)

  if isinstance(shopping_list, JSONResponse):
    return shopping_list
  
  shopping_list.checked = request.checked
  
  try:
    response = update_shopping_list(shopping_list, db)
    return success(ShoppingListResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def delete_shopping_list_api(shopping_list_id: int, db: Session):
  shopping_list = __private_shopping_list_check(shopping_list_id, db)

  if isinstance(shopping_list, JSONResponse):
    return shopping_list
  
  try:
    delete_shopping_list(shopping_list, db)
    return success(ShoppingListResponse.model_validate(shopping_list))
  except Exception:
    db.rollback()
    return error("db_error", 500)
  
# private

def __private_shopping_list_check(shopping_list_id: int, db: Session):
  shopping_list = get_shopping_list_by_id(shopping_list_id, db)
  
  if not shopping_list:
    return error("ShoppingList not found", 404)
  else:
    return shopping_list
