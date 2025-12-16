from sqlalchemy import ARRAY, UUID, BigInteger, Column, ForeignKey, Text, Boolean
from database import Base

class Memo(Base):
  __tablename__ = "memos"

  id = Column(BigInteger, primary_key=True, index=True)
  title = Column(Text, nullable=False)
  content = Column(Text)
  type = Column(Text)
  is_done = Column(Boolean, nullable=False)
  tags = Column(ARRAY(Text))
  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
