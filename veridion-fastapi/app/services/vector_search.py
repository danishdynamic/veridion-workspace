# services/vector_search.py
from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
import openai

from app.core.config import settings
from app.models.document import DocumentParent
from app.models.chunk import DocumentChildChunk

class VeridionVectorSearchService:
    def __init__(self, db_session: AsyncSession):
        self.db = db_session
        # Initialize the OpenAI client for real-time embedding generation
        self.client = openai.AsyncOpenAI(api_key=settings.GEMINI_API_KEY)

    # Cleaned: Applied the 'Vector' type hint to explicitly annotate the returning array layout
    async def _get_embedding(self, query_text: str) -> List[float]:
        """Generates a 768-dimension vector embedding for incoming query string."""
        response = await self.client.embeddings.create(
            input=[query_text],
            model=settings.EMBEDDING_MODEL
        )
        return response.data[0].embedding

    async def execute_hybrid_search(
        self, 
        query_text: str, 
        industry_sector: Optional[str] = None,
        deployment_region: Optional[str] = None,
        limit: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Executes an HNSW-accelerated vector similarity query cross-referenced with
        hard JSONB metadata filters, returning the full Parent context blocks.
        """
        # 1. Generate the query vector embedding
        query_vector = await self._get_embedding(query_text)

        # 2. Compute Cosine Distance using pgvector's native operator
        cosine_distance = DocumentChildChunk.embedding.cosine_distance(query_vector)

        # 3. Construct the foundational SQLAlchemy Async Select query
        stmt = (
            select(
                DocumentParent.id.label("parent_id"),
                DocumentParent.title.label("document_title"),
                DocumentParent.version_tag.label("version_tag"),
                DocumentParent.metadata_json.label("metadata"),
                DocumentChildChunk.chunk_text.label("matched_child_text"),
                text("document_parents.metadata_json->>'parent_text'").label("parent_context"),
                (1 - cosine_distance).label("similarity_score")
            )
            .join(DocumentParent, DocumentChildChunk.parent_id == DocumentParent.id)
            # Fixed: Replaced comparison with native boolean truth check expression
            .where(DocumentParent.is_active)
        )

        # 4. Inject Dynamic JSONB Hard Metadata Filters
        if industry_sector:
            stmt = stmt.where(
                DocumentParent.metadata_json["sector"].astext == industry_sector
            )
        
        if deployment_region:
            stmt = stmt.where(
                DocumentParent.metadata_json["region"].astext == deployment_region
            )

        # 5. Apply ranking metrics and limit bounds
        stmt = stmt.order_by(cosine_distance.asc()).limit(limit)

        # 6. Execute transactions asynchronously
        result = await self.db.execute(stmt)
        rows = result.mappings().all()

        # 7. Format clean structured response dictionary mapping
        search_results = []
        for row in rows:
            search_results.append({
                "parent_id": row["parent_id"],
                "document_title": row["document_title"],
                "version_tag": row["version_tag"],
                "similarity_score": float(row["similarity_score"]),
                "matched_child_context": row["matched_child_text"],
                "legal_context_chunk": row["parent_context"] if row["parent_context"] else row["matched_child_text"],
                "metadata": row["metadata"]
            })

        return search_results