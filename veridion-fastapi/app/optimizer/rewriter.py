# app/optimizer/rewriter.py
import logging
from typing import Optional

from app.core.config import settings
from app.services.llm import generate_response

logger = logging.getLogger("veridion_rewriter_service")


class ComplianceQueryRewriter:
    def __init__(self, confidence_threshold: float = 0.75):
        self.confidence_threshold = confidence_threshold

    def should_trigger_hyde(self, top_similarity_score: float) -> bool:
        """
        Determines whether HyDE query expansion is needed based on top vector similarity.
        """
        return top_similarity_score < self.confidence_threshold

    async def generate_hyde_document(
        self, 
        query: str, 
        sector: str = "General", 
        region: str = "Global",
        model: Optional[str] = None
    ) -> str:
        """
        Generates a hypothetical regulatory paragraph (HyDE) using the unified LLM service layer.
        """
        system_instruction = (
            f"You are an expert regulatory compliance officer specialized in the {sector} sector "
            f"within the {region} region. Generate official regulatory text strictly matching the user's domain."
        )

        prompt = (
            f"Write a hypothetical paragraph from an official regulatory framework or audit guideline that directly "
            f"addresses the following compliance concern: '{query}'.\n"
            f"Respond ONLY with the technical text paragraph. Do not include conversational intro or outro."
        )

        try:
            # Reuses unified generate_response with connection pool and temperature=0.0
            hyde_text = await generate_response(
                prompt=prompt,
                model=model or settings.DEFAULT_MODEL,
                temperature=0.0,
                system_instruction=system_instruction,
            )
            return hyde_text.strip()

        except Exception as e:
            logger.error(f"HyDE query rewriting phase failed: {str(e)}", exc_info=True)
            # Fall back gracefully to original raw query if LLM fails
            return query