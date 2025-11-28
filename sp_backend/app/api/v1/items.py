from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models.item import Item
from app.repositories.items_repo import create_item, delete_item, get_items, get_items_by_id, update_item
from app.schemas.item import ItemRequest, ItemResponse
from app.utils.response import error, success

def get_items_api(category_id: int, is_favorite: bool, db: Session):
  items = get_items(category_id, is_favorite, db)
  response = [ItemResponse.model_validate(c) for c in items]
  return success(response)

def get_item_api(item_id: int, db: Session):
  item = __private_item_check(item_id, db)
  
  if isinstance(item, JSONResponse):
    return item
  
  return success(ItemResponse.model_validate(item))

def create_item_api(request: ItemRequest, db: Session):
  new_item = Item(
    name=request.name,
    brand=request.brand,
    unit=request.unit,
    image_url=request.image_url,
    default_quantity=request.default_quantity,
    notes=request.notes,
    is_favorite=request.is_favorite
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

# private

def __private_item_check(item_id: int, db: Session):
  item = get_items_by_id(item_id, db)
  
  if not item:
    return error("Item not found", 404)
  else:
    return item