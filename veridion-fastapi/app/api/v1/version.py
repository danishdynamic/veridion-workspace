# app/api/v1/version.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.version import VersionCompareRequest, VersionCompareResponse
from app.services.version_service import version_service

router = APIRouter()


@router.post("/compare", response_model=VersionCompareResponse)
async def compare_document_versions(
    payload: VersionCompareRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Computes structured clause-level differences between two document versions directly in PostgreSQL/Gemini.
    """
    try:
        return await version_service.compare_versions(
            db=db,
            version_a_id=payload.version_a_id,
            version_b_id=payload.version_b_id,
            section_id=payload.section_id or ""
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Version comparison execution failed: {str(e)}"
        )