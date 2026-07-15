from typing import TYPE_CHECKING
from uuid import uuid4
from sqlalchemy import String, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.document import DocumentParent

class DocumentChildChunk(Base):
    __tablename__ = "document_child_chunks"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid4()))
    parent_id: Mapped[str] = mapped_column(
        String, 
        ForeignKey("document_parents.id", ondelete="CASCADE"), 
        nullable=False
    )
    
    chunk_text: Mapped[str] = mapped_column(String, nullable=False)
    embedding: Mapped[Vector] = mapped_column(Vector(768), nullable=False)

    parent: Mapped["DocumentParent"] = relationship(
        "DocumentParent", 
        back_populates="chunks",
        lazy="raise"
    )

# Accelerated HNSW metric mapping
Index(
    "idx_veridion_hnsw_cosine",
    DocumentChildChunk.embedding,
    postgresql_using="hnsw",
    postgresql_ops={"embedding": "vector_cosine_ops"},
    postgresql_with={"m": 16, "ef_construction": 64}
)