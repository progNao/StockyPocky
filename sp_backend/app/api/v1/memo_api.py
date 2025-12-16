from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.models.memo import Memo
from app.models.user import User
from app.repositories.memos_repo import create_memo, delete_memo, get_memo_by_id, get_memos, update_memo
from app.schemas.memo import CreateMemoRequest, MemoResponse
from app.utils.response import error, success

def get_memos_api(db: Session, current_user: User):
  memos = get_memos(current_user.id, db)
  response = [MemoResponse.model_validate(c) for c in memos]
  return success(response)

def get_memo_api(memo_id: int, db: Session):
  memo = __private_memo_check(memo_id, db)
  
  if isinstance(memo, JSONResponse):
    return memo
  
  return success(MemoResponse.model_validate(memo))

def create_memo_api(request: CreateMemoRequest, db: Session, current_user: User):
  new_memo = Memo(
    title=request.title,
    content=request.content,
    type=request.type,
    is_done=request.is_done,
    tags=request.tags,
    user_id=current_user.id
  )

  try:
    create_memo(new_memo, db)
    return success(MemoResponse.model_validate(new_memo))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def update_memo_api(memo_id: int, request: CreateMemoRequest, db: Session):
  memo = __private_memo_check(memo_id, db)
  
  if isinstance(memo, JSONResponse):
    return memo

  memo.title = request.title
  if request.content:
    memo.content = request.content
  if request.type:
    memo.type = request.type
  memo.is_done = request.is_done
  if request.tags:
    memo.tags = request.tags
    
  try:
    response = update_memo(memo, db)
    return success(MemoResponse.model_validate(response))
  except Exception:
    db.rollback()
    return error("db_error", 500)

def delete_memo_api(memo_id: int, db: Session):
  memo = __private_memo_check(memo_id, db)
  
  if isinstance(memo, JSONResponse):
    return memo
  
  try:
    delete_memo(memo, db)
    return success(MemoResponse.model_validate(memo))
  except Exception:
    db.rollback()
    return error("db_error", 500)

# private

def __private_memo_check(memo_id: int, db: Session):
  memo = get_memo_by_id(memo_id, db)
  
  if not memo:
    return error("Memo not found", 404)
  else:
    return memo
