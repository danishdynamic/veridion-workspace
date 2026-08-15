from typing import TYPE_CHECKING
from uuid import uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.clause import Clause
    from app.models.version import DocumentVersion


class DocumentSection(Base):
    __tablename__ = "document_sections"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    version_id: Mapped[str] = mapped_column(
        String, 
        ForeignKey("document_versions.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    title: Mapped[str] = mapped_column(String, nullable=False)
    
    part_number: Mapped[int] = mapped_column(Integer, nullable=False)
    heading: Mapped[str | None] = mapped_column(String, nullable=True)
    section_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[Vector | None] = mapped_column(Vector(768), nullable=True)  # FIXED: Corrected 786 to 768

    version: Mapped["DocumentVersion"] = relationship("DocumentVersion", back_populates="sections", lazy="raise")
    clauses: Mapped[list["Clause"]] = relationship(
        "Clause", 
        back_populates="section",
        cascade="all, delete-orphan",
        lazy="raise"
    )


Index(
    "idx_sections_hnsw_cosine",
    DocumentSection.embedding,
    postgresql_using="hnsw",
    postgresql_ops={"embedding": "vector_cosine_ops"},
    postgresql_with={"m": 16, "ef_construction": 64}
)