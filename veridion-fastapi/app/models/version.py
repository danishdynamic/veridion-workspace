from datetime import datetime
from typing import TYPE_CHECKING
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.document import DocumentParent
    from app.models.section import DocumentSection


class DocumentVersion(Base):
    __tablename__ = "document_versions"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    
    # 1. FIXED: Point to "document_parents.id"
    document_id: Mapped[str] = mapped_column(
        String, 
        ForeignKey("document_parents.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    version_number: Mapped[str] = mapped_column(String, nullable=False)  
    effective_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_latest: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    metadata_json: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    
    # 2. FIXED: Use server_default for SQL timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    # 3. FIXED: Point relationship to "DocumentParent"
    document: Mapped["DocumentParent"] = relationship("DocumentParent", back_populates="versions", lazy="raise")
    
    sections: Mapped[list["DocumentSection"]] = relationship(
        "DocumentSection",
        back_populates="version",
        cascade="all, delete-orphan",
        lazy="raise"
    )


# Composite index for quickly locating active document versions
Index("idx_doc_version_latest", DocumentVersion.document_id, DocumentVersion.is_latest)