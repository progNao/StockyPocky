from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from utils.response import error
from database import get_db

router = APIRouter(prefix="/users", tags=["users"])

# @router.get("/")
# def get_users(db: Session = Depends(get_db)):
#   # ダミー
#   users = [{"id": 1, "name": "Nao"}, {"id": 2, "name": "Taro"}]
#   return success(data=users)


# @router.get("/{user_id}")
# def get_user(user_id: int, db: Session = Depends(get_db)):
#   if user_id == 0:
#     return error("Invalid user ID", 400)

#   user = {"id": user_id, "name": "UserName"}
#   return success(data=user)
