from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from streamlit import status
from app.utils.jwt import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
  payload = decode_access_token(token)
  if not payload:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
  return payload
