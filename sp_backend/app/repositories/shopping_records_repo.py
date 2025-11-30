from uuid import UUID
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.models.category import Category
from app.models.item import Item
from app.models.shopping_record import ShoppingRecord

def get_shopping_records(user_id: UUID, db: Session):
  return db.query(ShoppingRecord).filter(ShoppingRecord.user_id == user_id).all()

def get_shopping_record_by_id(shopping_record_id: int, db: Session):
  return db.query(ShoppingRecord).filter(ShoppingRecord.id == shopping_record_id).first()

def create_shopping_record(request: ShoppingRecord, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_shopping_record(request: ShoppingRecord, db: Session):
  __private_db_change(request, db)
  return request

def delete_shopping_record(request: ShoppingRecord, db: Session):
  db.delete(request)
  db.commit()
  return request

def get_monthly_spending(user_id: UUID, db: Session):
  query = (
    db.query(
      func.date_trunc('month', ShoppingRecord.bought_at).label('month'),
      func.sum(ShoppingRecord.price * ShoppingRecord.quantity).label('total_amount')
    )
    .filter(ShoppingRecord.user_id == user_id)
    .group_by(func.date_trunc('month', ShoppingRecord.bought_at))
    .order_by(func.date_trunc('month', ShoppingRecord.bought_at).desc())
  )
  return query.all()

def get_spending_by_item(user_id: UUID, db: Session):
  query = (
    db.query(
      Item.id,
      Item.name,
      func.sum(ShoppingRecord.price * ShoppingRecord.quantity).label("total_amount")
    )
    .join(Item, ShoppingRecord.item_id == Item.id)
    .filter(ShoppingRecord.user_id == user_id)
    .group_by(Item.id, Item.name)
    .order_by(func.sum(ShoppingRecord.price * ShoppingRecord.quantity).desc())
  )
  return query.all()

def get_spending_by_category(user_id: UUID, db: Session):
  query = (
    db.query(
      Category.id,
      Category.name,
      func.sum(ShoppingRecord.price * ShoppingRecord.quantity).label("total_amount")
    )
    .join(Item, ShoppingRecord.item_id == Item.id)
    .join(Category, Item.category_id == Category.id)
    .filter(ShoppingRecord.user_id == user_id)
    .group_by(Category.id, Category.name)
    .order_by(func.sum(ShoppingRecord.price * ShoppingRecord.quantity).desc())
  )
  return query.all()

# private

def __private_db_change(data: ShoppingRecord, db: Session):
  db.commit()
  db.refresh(data)