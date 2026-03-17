from sqlalchemy import Column, String, DateTime, Integer
from app.db.database import Base
from datetime import datetime
import uuid

class Image(Base):
    __tablename__ = "images"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    prompt = Column(String, nullable=False)
    url = Column(String, nullable=False)
    status = Column(String, default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
