from sqlalchemy import UUID, BigInteger, Column, DateTime, ForeignKey, Numeric, Text
from database import Base

class ShoppingRecord(Base):
  __tablename__ = "shopping_records"

  id = Column(BigInteger, primary_key=True, index=True)
  quantity = Column(Numeric, nullable=False)
  price = Column(Numeric, nullable=False)
  store = Column(Text, nullable=False)
  bought_at = Column(DateTime, nullable=False)
  item_id = Column(BigInteger, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
