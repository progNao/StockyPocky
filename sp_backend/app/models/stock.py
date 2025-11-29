from sqlalchemy import UUID, BigInteger, Column, ForeignKey, Numeric, Text
from database import Base

class Stock(Base):
  __tablename__ = "stocks"

  id = Column(BigInteger, primary_key=True, index=True)
  quantity = Column(Numeric, nullable=False)
  threshold = Column(Numeric, nullable=False)
  location = Column(Text, nullable=False)
  item_id = Column(BigInteger, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
