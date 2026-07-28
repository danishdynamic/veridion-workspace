import json
import logging
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.optimizer.reranker import ComplianceReranker
from app.optimizer.rewriter import ComplianceQueryRewriter
from app.services.kv_cache import kv_cache
from app.services.llm import generate_response
from app.services.vector_search import VeridionVectorSearchService
from app.services.pipeline import rag_pipeline

logger = logging.getLogger("veridion_retrieval_router")

router = APIRouter()

# Instantiate optimization engines
rewriter = ComplianceQueryRewriter()
reranker = ComplianceReranker()

# Pipeline execution tracking constants for strict KV Cache invalidation
MODEL_NAME = settings.DEFAULT_MODEL
PROMPT_VERSION = "v1.0"
PIPELINE_VERSION = "v1.0"


# --- REQUEST / RESPONSE SCHEMAS ---

class ComplianceSearchRequest(BaseModel):
    query: str = Field(..., min_length=3, description="Semantic compliance lookup target string")
    industry_sector: Optional[str] = Field(None, description="Hard filter optimization category parameter")
    deployment_region: Optional[str] = Field(None, description="Target geo bounds constraint zone")
    limit: Optional[int] = Field(4, ge=1, le=20)


class ComplianceSearchResponse(BaseModel):
    document_id: str
    document_title: str
    version_id: str
    version_number: str
    section_id: str
    section_heading: Optional[str]
    clause_id: str
    clause_number: Optional[str]
    clause_text: str
    similarity_score: float
    metadata: dict[str, Any]


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


@router.post("/query", response_model=list[ComplianceSearchResponse])
async def query_compliance_matrix(
    payload: ComplianceSearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Executes an optimized vector compliance lookup utilizing threshold-gated HyDE query expansion,
    hybrid pgvector metadata filtering, multi-parameter Redis KV caching, and Cross-Encoder re-ranking.
    """
    try:
        search_service = VeridionVectorSearchService(db_session=db)
        request_limit = payload.limit if payload.limit is not None else 4
        
        sector = payload.industry_sector or "General"
        region = payload.deployment_region or "Global"
        
        # ----------------------------------------------------------------------
        # 1. Fast Path: Direct vector search first (No initial LLM latency)
        # ----------------------------------------------------------------------
        raw_db_rows = await search_service.execute_hybrid_search(
            query_text=payload.query,
            industry_sector=payload.industry_sector,
            deployment_region=payload.deployment_region,
            limit=20  # Over-fetching candidate pool for re-ranking
        )
        
        # ----------------------------------------------------------------------
        # 2. Threshold Check: Trigger HyDE fallback ONLY if confidence is low
        # ----------------------------------------------------------------------
        top_score = raw_db_rows[0].get("similarity_score", 0.0) if raw_db_rows else 0.0

        if rewriter.should_trigger_hyde(top_score):
            expanded_query = await rewriter.generate_hyde_document(
                query=payload.query, 
                sector=sector, 
                region=region
            )
            
            # Re-execute search with hypothetical compliance text
            raw_db_rows = await search_service.execute_hybrid_search(
                query_text=expanded_query,
                industry_sector=payload.industry_sector,
                deployment_region=payload.deployment_region,
                limit=20
            )

        # Early exit if zero matching records were found across both passes
        if not raw_db_rows:
            return []

        # ----------------------------------------------------------------------
        # 3. Cache Evaluation: Extract clause_ids & query Redis with pipeline state
        # ----------------------------------------------------------------------
        context_ids = [str(row["clause_id"]) for row in raw_db_rows]
        
        cached_inference = await kv_cache.get_cached_inference(
            chunk_ids=context_ids, 
            query=payload.query,
            model=MODEL_NAME,
            prompt_version=PROMPT_VERSION,
            version=PIPELINE_VERSION
        )
        
        if cached_inference:
            return json.loads(cached_inference)
        
        # ----------------------------------------------------------------------
        # 4. Cross-Encoder Re-Ranking & Cache Update
        # ----------------------------------------------------------------------
        optimized_results = reranker.rerank_contexts(
            query=payload.query, 
            raw_results=raw_db_rows, 
            top_n=request_limit
        )
        
        # Save to Redis using the exact pipeline parameter signature
        await kv_cache.set_cached_inference(
            chunk_ids=context_ids, 
            query=payload.query, 
            response_text=json.dumps(optimized_results),
            model=MODEL_NAME,
            prompt_version=PROMPT_VERSION,
            version=PIPELINE_VERSION
        )
        
        return optimized_results

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Semantic compliance execution engine exception: {str(e)}"
        )