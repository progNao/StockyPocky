from sqlalchemy import UUID, BigInteger, Column, DateTime, ForeignKey, Numeric, Boolean, func
from database import Base

class ShoppingList(Base):
  __tablename__ = "shopping_list"

  id = Column(BigInteger, primary_key=True, index=True)
  quantity = Column(Numeric, nullable=False)
  checked = Column(Boolean, nullable=False)
  item_id = Column(BigInteger, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  added_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
