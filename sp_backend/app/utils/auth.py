from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from app.repositories.users_repo import get_user_for_name_only
from app.utils.jwt import decode_access_token
from database import get_db

# JWTの設定
SECRET_KEY = "supersecretkey"  # 本番では.env管理
ALGORITHM = "HS256"

# FastAPI 用の OAuth2 スキーム
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

api_key_header = APIKeyHeader(name="Authorization")

# トークンを検証してユーザー情報を返す関数
def get_current_user(token: str = Depends(api_key_header), db: Session = Depends(get_db)):
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
  )
  
  if not token.startswith("Bearer "):
    raise HTTPException(status_code=401, detail="Invalid token")
  token_value = token.split(" ")[1]

  try:
    payload = decode_access_token(token_value)
    username: str = payload.get("sub")
    if username is None:
      raise credentials_exception
  except JWTError:
    raise credentials_exception

  user = get_user_for_name_only(username, db)
  if user is None:
    raise credentials_exception
  return user