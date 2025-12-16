from uuid import UUID
from sqlalchemy.orm import Session
from app.models.shopping_list import ShoppingList

def get_shopping_lists(user_id: UUID, db: Session):
  return db.query(ShoppingList).filter(ShoppingList.user_id == user_id).all()

def get_shopping_list_by_id(shopping_list_id: int, db: Session):
  return db.query(ShoppingList).filter(ShoppingList.id == shopping_list_id).first()

def get_shopping_list_by_item(user_id: int, item_id: int, db: Session):
  return db.query(ShoppingList).filter(ShoppingList.user_id == user_id, ShoppingList.item_id == item_id).first()

def create_shopping_list(request: ShoppingList, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_shopping_list(request: ShoppingList, db: Session):
  __private_db_change(request, db)
  return request

def delete_shopping_list(request: ShoppingList, db: Session):
  db.delete(request)
  db.commit()
  return request

# private

def __private_db_change(data: ShoppingList, db: Session):
  db.commit()
  db.refresh(data)