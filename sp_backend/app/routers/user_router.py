from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.response import SuccessResponse
from app.schemas.user import UpdateMeRequest
from app.utils.auth import get_current_user
from app.utils.response import success
from database import get_db

router = APIRouter(prefix="/users", tags=["users"], dependencies=[Depends(get_current_user)])

@router.get("/me", response_model=SuccessResponse)
def get_me(current_user: User = Depends(get_current_user)):
  return success({
    "name": current_user.name,
    "email": current_user.email,
  })

@router.put("/me")
def update_me(
    body: UpdateMeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.name = body.name
    db.commit()
    db.refresh(current_user)

    return success({
    "name": current_user.name,
    "email": current_user.email,
  })
