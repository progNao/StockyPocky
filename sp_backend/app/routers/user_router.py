from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.v1.users_api import delete_user_api, get_user_api, get_users_api, update_user_api
from app.schemas.response import SuccessResponse
from app.schemas.user import SignupRequest
from app.utils.auth import get_current_user
from database import get_db

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(get_current_user)])

@router.get("", response_model=SuccessResponse)
def get_users(db: Session = Depends(get_db)):
  return get_users_api(db)

@router.get("/{user_id}", response_model=SuccessResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
  return get_user_api(user_id, db)

@router.put("/{user_id}", response_model=SuccessResponse)
def update_user(user_id: UUID, payload: SignupRequest, db: Session = Depends(get_db)):
  return update_user_api(user_id, payload, db)

@router.delete("/{user_id}", response_model=SuccessResponse)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
  return delete_user_api(user_id, db)
