from uuid import UUID
from sqlalchemy.orm import Session
from app.models.item import Item

def get_items(user_id: UUID, category_id: int, is_favorite: bool, db: Session):
  query = db.query(Item)
  if category_id is not None:
    query = query.filter(Item.category_id == category_id)
  if is_favorite is not None:
    query = query.filter(Item.is_favorite == is_favorite)
  return query.filter(Item.user_id == user_id).all()

def get_item_by_category(category_id: int, db: Session):
  return db.query(Item).filter(Item.category_id == category_id).first()

def get_items_by_id(item_id: int, db: Session):
  return db.query(Item).filter(Item.id == item_id).first()

def create_item(request: Item, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_item(request: Item, db: Session):
  __private_db_change(request, db)
  return request

def delete_item(request: Item, db: Session):
  db.delete(request)
  db.commit()
  return request

# private

def __private_db_change(data: Item, db: Session):
  db.commit()
  db.refresh(data)