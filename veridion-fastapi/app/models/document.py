#models/document.py
from datetime import datetime
from typing import List, TYPE_CHECKING
from uuid import uuid4
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.chunk import DocumentChildChunk

class DocumentParent(Base):
    __tablename__ = "document_parents"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    title: Mapped[str] = mapped_column(String, nullable=False)
    version_tag: Mapped[str] = mapped_column(String, nullable=False)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=lambda: {}, nullable=False)
    

    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    chunks: Mapped[List["DocumentChildChunk"]] = relationship(
        "DocumentChildChunk",
        back_populates="parent",
        cascade="all, delete-orphan",
        lazy="raise" 
    )