# app/services/version_service.py
import json
import logging
from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.models.clause import Clause
from app.models.section import DocumentSection
from app.schemas.version import ClauseChangeResponse, VersionCompareResponse, ChangeType
from app.services.llm import generate_response

logger = logging.getLogger("veridion_version_service")


class VersionComparisonService:
    async def compare_versions(
        self, 
        db: AsyncSession, 
        version_a_id: str, 
        version_b_id: str,
        section_id: str 
    ) -> VersionCompareResponse:
        
        # 1. Retrieve Clauses for Version A (Baseline)
        stmt_a = (
            select(Clause)
            .join(DocumentSection)
            .where(DocumentSection.version_id == version_a_id)
            .order_by(Clause.sequence_order)
        )
        if section_id:
            stmt_a = stmt_a.where(DocumentSection.id == section_id)
        
        result_a = await db.execute(stmt_a)
        clauses_a = result_a.scalars().all()

        # 2. Retrieve Clauses for Version B (Target)
        stmt_b = (
            select(Clause)
            .join(DocumentSection)
            .where(DocumentSection.version_id == version_b_id)
            .order_by(Clause.sequence_order)
        )
        if section_id:
            stmt_b = stmt_b.where(DocumentSection.id == section_id)

        result_b = await db.execute(stmt_b)
        clauses_b = result_b.scalars().all()

        # 3. Build text representations for LLM analysis
        text_a = "\n".join([f"[{c.clause_number or 'Clause'}] {c.clause_text}" for c in clauses_a])
        text_b = "\n".join([f"[{c.clause_number or 'Clause'}] {c.clause_text}" for c in clauses_b])

        system_instruction = (
            "You are a regulatory diff engine. Compare Baseline (Version A) against Target (Version B) "
            "and output a strict JSON array of clause changes."
        )

        prompt = f"""
            Baseline Version (Version A):
            {text_a or 'None'}

            Target Version (Version B):
            {text_b or 'None'}

            Output strictly a JSON array matching this schema:
            [
            {{
                "clause_number": "Clause ID / Article Number",
                "change_type": "NEW" | "MODIFIED" | "REMOVED" | "UNCHANGED",
                "old_text": "Text in Version A or null",
                "new_text": "Text in Version B or null",
                "impact_assessment": "Concise analysis of regulatory shift"
            }}
            ]
            """

        raw_llm_response = await generate_response(
            prompt=prompt,
            model=settings.DEFAULT_MODEL,
            temperature=0.0,
            system_instruction=system_instruction
        )

        # 4. Clean and parse JSON response
        try:
            cleaned = raw_llm_response.replace("```json", "").replace("```", "").strip()
            parsed_changes = json.loads(cleaned)
            
            changes = [ClauseChangeResponse(**item) for item in parsed_changes]
            has_diffs = any(c.change_type != ChangeType.UNCHANGED for c in changes)

            return VersionCompareResponse(
                version_a_id=version_a_id,
                version_b_id=version_b_id,
                has_diffs=has_diffs,
                changes=changes
            )

        except Exception as e:
            logger.error(f"Failed to parse version comparison output: {e}")
            return VersionCompareResponse(
                version_a_id=version_a_id,
                version_b_id=version_b_id,
                has_diffs=False,
                changes=[]
            )


version_service = VersionComparisonService()