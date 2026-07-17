# api/v1/retrieve.py
import json
from typing import Optional, List
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.vector_search import VeridionVectorSearchService
from app.optimizer.rewriter import ComplianceQueryRewriter
from app.optimizer.reranker import ComplianceReranker
from app.services.llm import generate_response
from app.services.kv_cache import kv_cache

router = APIRouter()

# Instantiate optimization engines
rewriter = ComplianceQueryRewriter()
reranker = ComplianceReranker()

# --- REQUEST / RESPONSE SCHEMAS ---

class ComplianceSearchRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Semantic compliance lookup target string")
    industry_sector: Optional[str] = Field(None, description="Hard filter optimization category parameter")
    deployment_region: Optional[str] = Field(None, description="Target geo bounds constraint zone")
    limit: Optional[int] = Field(4, ge=1, le=20)

class ComplianceSearchResponse(BaseModel):
    parent_id: str
    document_title: str
    version_tag: str
    similarity_score: float
    matched_child_context: str
    legal_context_chunk: str
    metadata: dict

class ChatPayload(BaseModel):
    prompt: str


# --- ROUTE ARCHITECTURES ---

@router.post("/chat", status_code=status.HTTP_200_OK)
async def chat_endpoint(payload: ChatPayload):
    """
    Evaluates incoming conversational payloads through the generative AI substrate layer.
    """
    if not payload.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Prompt cannot be empty."
        )
        
    try:
        ai_response = await generate_response(prompt=payload.prompt)
        return {"response": ai_response}
        
    except RuntimeError as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(err)
        )


@router.post("/query", response_model=List[ComplianceSearchResponse])
async def query_compliance_matrix(
    payload: ComplianceSearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Executes a high-performance vector compliance lookup utilizing HyDE query expansion,
    hybrid pgvector metadata filtering, Redis KV caching, and Cross-Encoder re-ranking.
    """
    try:
        search_service = VeridionVectorSearchService(db_session=db)
        request_limit = payload.limit if payload.limit is not None else 4
        
        sector = payload.industry_sector or "General"
        region = payload.deployment_region or "Global"
        
        # 1. Expand query via HyDE (Hypothetical Document Embeddings)
        expanded_query = await rewriter.generate_hyde_document(
            query=payload.query, 
            sector=sector, 
            region=region
        )
        
        # 2. Fetch raw vector matches from pgvector via the expanded query
        # Over-fetching (limit=20) provides a healthy candidate pool for the re-ranker
        raw_db_rows = await search_service.execute_hybrid_search(
            query_text=expanded_query,
            industry_sector=payload.industry_sector,
            deployment_region=payload.deployment_region,
            limit=20  
        )
        
        # 3. Handle early exit if zero matching records are located in database
        if not raw_db_rows:
            return []

        # 4. Extract matching chunk IDs to check high-speed Redis KV Cache state
        chunk_ids = [str(row["id"]) for row in raw_db_rows]
        
        # 5. Check KV Cache before executing expensive re-ranking calculation blocks
        cached_inference = await kv_cache.get_cached_inference(chunk_ids, payload.query)
        if cached_inference:
            return json.loads(cached_inference)
        
        # 6. Rerank down to absolute top-tier quality context using Cross-Encoders
        optimized_results = reranker.rerank_contexts(
            query=payload.query, 
            raw_results=raw_db_rows, 
            top_n=request_limit
        )
        
        # 7. Save optimized response metrics to Cache layer for future operations
        await kv_cache.set_cached_inference(chunk_ids, payload.query, json.dumps(optimized_results))
        
        return optimized_results

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Semantic compliance execution engine exception: {str(e)}"
        )