from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.v1.users import delete_user_api, get_user_api, get_users_api, update_user_api
from utils.auth import get_current_user
from schemas.user import UpdateUserRequest
from schemas.response import SuccessResponse
from database import get_db

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(get_current_user)])

@router.get("/", response_model=SuccessResponse)
def get_users(db: Session = Depends(get_db)):
  return get_users_api(db)

@router.get("/{user_id}", response_model=SuccessResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db)):
  return get_user_api(user_id, db)

@router.put("/", response_model=SuccessResponse)
def update_user(payload: UpdateUserRequest, db: Session = Depends(get_db)):
  return update_user_api(payload, db)

@router.delete("/{user_id}", response_model=SuccessResponse)
def delete_user(user_id: UUID, db: Session = Depends(get_db)):
  return delete_user_api(user_id, db)