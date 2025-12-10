from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from app.api.v1.memo_api import create_memo_api, delete_memo_api, get_memo_api, get_memos_api, update_memo_api
from app.models.user import User
from app.schemas.memo import CreateMemoRequest
from app.schemas.response import SuccessResponse
from app.utils.auth import get_current_user
from database import get_db


router = APIRouter(prefix="/memos", tags=["memos"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_memos(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return get_memos_api(db, current_user)

@router.get("/{memo_id}", response_model=SuccessResponse)
def get_memo(memo_id: int, db: Session = Depends(get_db)):
  return get_memo_api(memo_id, db)

@router.post("", response_model=SuccessResponse)
def create_memo(request: CreateMemoRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
  return create_memo_api(request, db, current_user)

@router.put("/{memo_id}", response_model=SuccessResponse)
def update_memo(memo_id: int, request: CreateMemoRequest, db: Session = Depends(get_db)):
  return update_memo_api(memo_id, request, db)

@router.delete("/{memo_id}", response_model=SuccessResponse)
def delete_memo(memo_id: int, db: Session = Depends(get_db)):
  return delete_memo_api(memo_id, db)
