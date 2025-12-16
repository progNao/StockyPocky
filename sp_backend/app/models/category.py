from sqlalchemy import UUID, BigInteger, Column, ForeignKey, Text
from database import Base

class Category(Base):
  __tablename__ = "categories"

  id = Column(BigInteger, primary_key=True, index=True)
  name = Column(Text, nullable=False)
  icon = Column(Text)
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
