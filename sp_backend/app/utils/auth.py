from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from sqlalchemy.orm import Session

from app.models.user import User
from database import get_db

security = HTTPBearer()

def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    try:
      decoded = auth.verify_id_token(cred.credentials)
    except Exception as e:
      print("VERIFY ERROR >>>", repr(e))
      raise HTTPException(status_code=401, detail="Invalid token")

    firebase_uid = decoded["uid"]
    email = decoded.get("email")

    user = db.query(User).filter(
      User.firebase_uid == firebase_uid
    ).first()

    if user:
      return user

    # 🔽 初回ログイン時のみ作成
    user = User(
      email=email,
      name=email.split("@")[0],
      firebase_uid=firebase_uid,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user