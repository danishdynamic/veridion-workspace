# app/models/clause.py
from typing import TYPE_CHECKING, Optional
from uuid import uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.section import DocumentSection


class Clause(Base):
    __tablename__ = "clauses"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    section_id: Mapped[str] = mapped_column(
        String, 
        ForeignKey("sections.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )

    clause_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True) # e.g., "4.1.2"
    clause_text: Mapped[str] = mapped_column(Text, nullable=False)
    sequence_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Updated to 768 dimensions for Gemini text-embedding-004
    embedding: Mapped[list[float]] = mapped_column(Vector(768), nullable=False)

    # Tier 3 Parent Link
    section: Mapped["DocumentSection"] = relationship(
        "Section", 
        back_populates="clauses",
        lazy="raise"
    )


# Accelerated HNSW metric index on 768-dimensional cosine distance
Index(
    "idx_clauses_hnsw_cosine",
    Clause.embedding,
    postgresql_using="hnsw",
    postgresql_ops={"embedding": "vector_cosine_ops"},
    postgresql_with={"m": 16, "ef_construction": 64}
)