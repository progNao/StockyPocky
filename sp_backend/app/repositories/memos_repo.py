from uuid import UUID
from sqlalchemy.orm import Session
from app.models.memo import Memo

def get_memos(user_id: UUID, db: Session):
  return db.query(Memo).filter(Memo.user_id == user_id).all()

def get_memo_by_id(memo_id: int, db: Session):
  return db.query(Memo).filter(Memo.id == memo_id).first()

def create_memo(request: Memo, db: Session):
  db.add(request)
  __private_db_change(request, db)
  return request

def update_memo(request: Memo, db: Session):
  __private_db_change(request, db)
  return request

def delete_memo(request: Memo, db: Session):
  db.delete(request)
  db.commit()
  return request

# private

def __private_db_change(data: Memo, db: Session):
  db.commit()
  db.refresh(data)