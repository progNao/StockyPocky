from sqlalchemy import TIMESTAMP, UUID, BigInteger, Column, ForeignKey, Numeric, Text
from database import Base

class StockHistory(Base):
  __tablename__ = "stock_history"

  id = Column(BigInteger, primary_key=True, index=True)
  change = Column(Numeric, nullable=False)
  reason = Column(Text)
  memo = Column(Text)
  item_id = Column(BigInteger, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  created_at = Column(TIMESTAMP(timezone=True), nullable=False)
