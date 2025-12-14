from sqlalchemy import UUID, Column, Text
from database import Base

class User(Base):
  __tablename__ = "users"

  id = Column(UUID(as_uuid=True), primary_key=True, index=True, server_default="gen_random_uuid()")
  name = Column(Text)
  email = Column(Text, unique=True, nullable=False)
  firebase_uid = Column(Text)