# app/models/chunk.py
from typing import TYPE_CHECKING
from uuid import uuid4

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.document import DocumentParent

class DocumentChildChunk(Base):
    __tablename__ = "document_child_chunks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    parent_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("document_parents.id", ondelete="CASCADE"),  
        nullable=False,
        index=True
    )
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[Vector | None] = mapped_column(Vector(768), nullable=True)

    parent: Mapped["DocumentParent"] = relationship(
        "DocumentParent",  
        back_populates="chunks",
        lazy="raise"
    )

Index(
    "idx_chunks_hnsw_cosine",
    DocumentChildChunk.embedding,
    postgresql_using="hnsw",
    postgresql_ops={"embedding": "vector_cosine_ops"},
    postgresql_with={"m": 16, "ef_construction": 64}
)