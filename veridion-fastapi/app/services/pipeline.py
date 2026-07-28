# app/services/pipeline.py
import logging
from typing import Any, Dict, List, Optional

from app.core.config import settings
from app.evaluation.anti_hallucination import AntiHallucinationGuardrail
from app.metrics.metrics import metrics_monitor
from app.services.llm import generate_response

logger = logging.getLogger("veridion_rag_pipeline")


class ComplianceRAGPipeline:
    def __init__(self):
        self.guardrail = AntiHallucinationGuardrail()

    async def synthesize_answer(self, query: str, contexts: List[str]) -> str:
        """
        Synthesizes a precise compliance answer based strictly on retrieved legal contexts.
        """
        formatted_context = "\n\n---\n\n".join(contexts)
        
        system_instruction = (
            "You are a legal and regulatory compliance expert. "
            "Answer the user's compliance query accurately based ONLY on the provided context passages. "
            "If the context does not contain enough information to answer, explicitly state that."
        )

        prompt = (
            f"Retrieved Regulatory Context:\n{formatted_context}\n\n"
            f"Compliance Query: {query}\n\n"
            f"Provide a clear, technical, and objective answer."
        )

        # 1. Track rate limits and token metrics
        await metrics_monitor.track_request(
            model=settings.DEFAULT_MODEL, 
            prompt=f"{system_instruction} {prompt}"
        )

        # 2. Call centralized Gemini LLM service
        return await generate_response(
            prompt=prompt,
            model=settings.DEFAULT_MODEL,
            temperature=0.0,
            system_instruction=system_instruction,
        )

    async def generate_and_verify_compliance_response(
        self, query: str, retrieved_contexts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Orchestrates answer generation and NLI-based anti-hallucination verification.
        """
        if not retrieved_contexts:
            return {
                "status": "empty",
                "answer": "No relevant compliance contexts were found to answer your query.",
                "source_contexts": [],
            }

        # Safely extract text across 4-tier schema keys ('clause_text', 'text', 'legal_context_chunk')
        source_texts = [
            ctx.get("clause_text") or ctx.get("text") or ctx.get("legal_context_chunk") or ""
            for ctx in retrieved_contexts
        ]
        source_texts = [t for t in source_texts if t.strip()]

        # 1. Synthesize raw answer using our LLM service
        raw_answer = await self.synthesize_answer(query=query, contexts=source_texts)

        # 2. Post-generation guardrail verification
        eval_report = await self.guardrail.verify_alignment(
            generated_answer=raw_answer, 
            source_contexts=source_texts
        )

        # 3. Decision boundary
        if eval_report.get("is_hallucinated"):
            logger.warning(f"Hallucination detected for query: '{query[:50]}...'")
            return {
                "status": "flagged",
                "answer": "The generated compliance answer contained unverified claims based on our source records.",
                "unsupported_claims": eval_report.get("unsupported_claims", []),
                "source_contexts": retrieved_contexts,
            }

        return {
            "status": "success",
            "answer": raw_answer,
            "source_contexts": retrieved_contexts,
        }


# Global singleton pipeline
rag_pipeline = ComplianceRAGPipeline()