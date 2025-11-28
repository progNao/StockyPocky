from sqlalchemy import UUID, BigInteger, Boolean, Column, ForeignKey, Numeric, Text
from database import Base

class Item(Base):
  __tablename__ = "items"

  id = Column(BigInteger, primary_key=True, index=True)
  name = Column(Text, nullable=False)
  brand = Column(Text)
  unit = Column(Text)
  image_url = Column(Text)
  default_quantity = Column(Numeric, nullable=False)
  notes = Column(Text)
  is_favorite = Column(Boolean, nullable=False)
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
  category_id = Column(BigInteger, ForeignKey("categories.id"), nullable=False)
