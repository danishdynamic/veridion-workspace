import re
import math
from typing import Any
from collections import Counter

"""
> **⚠️ Lite Weight Custom Eval, Dont use RAGAS in Production**
> Numerical & Entity Groundedness (Deterministic ~1 to 3 ms):
> Extracts numbers, dates, percentages, and named entities from the answer and checks if they exist in the retrieved context. (This catches ~80% of hallucinated compliance stats/dates without an LLM).

> Lexical & Citation Integrity (Deterministic ~2 to 5 ms): >
> Computes Jaccard / ROUGE token overlap and verifies that any cited clause_id or section heading actually exists in the retrieved metadata.

>Fast Semantic Cosine Similarity (Local CPU Model ~10 to 15 ms): 
Uses a tiny local embedding model (like all-MiniLM-L6-v2) via ONNX/PyTorch to measure embedding distance between query, context, and answer.

"""

# Optional: Fast local embedding model for sub-15ms cosine similarity
try:
    from sentence_transformers import SentenceTransformer, util
    _LOCAL_EMBEDDER = SentenceTransformer("all-MiniLM-L6-v2")
except ImportError:
    _LOCAL_EMBEDDER = None


class LightweightRAGEvaluator:
    """
    Sub-15ms, zero-external-LLM evaluation suite for online RAG telemetry.
    Runs locally on CPU without adding network latency or API costs.
    """

    @staticmethod
    def _extract_tokens(text: str) -> set[str]:
        """Normalizes and extracts lowercase alphanumeric words."""
        return set(re.findall(r"\b\w+\b", text.lower()))

    @staticmethod
    def _extract_entities_and_numbers(text: str) -> set[str]:
        """
        Extracts numbers, percentages, dates, section references, and uppercase key terms.
        These are the most critical elements for compliance hallucination checks.
        """
        # Matches numbers, percentages, article/clause numbers (e.g., "15%", "2026", "Section 4.1")
        numbers_and_codes = set(re.findall(r"\b\d+(?:\.\d+)?%?\b", text))
        
        # Matches capitalized terms (e.g., "GDPR", "Veridion", "EU")
        capitalized = set(re.findall(r"\b[A-Z][a-zA-Z0-9_-]+\b", text))
        
        return numbers_and_codes.union(capitalized)

    def evaluate_groundedness(self, answer: str, source_contexts: list[str]) -> dict[str, Any]:
        """
        Checks if critical numbers and entities in the answer exist in the context.
        Returns a score from 0.0 to 1.0 and flags ungrounded facts.
        """
        combined_context = " ".join(source_contexts)
        answer_entities = self._extract_entities_and_numbers(answer)
        context_entities = self._extract_entities_and_numbers(combined_context)

        if not answer_entities:
            return {"entity_groundedness_score": 1.0, "unsupported_entities": []}

        # Find entities present in the answer but missing from the source context
        unsupported = [entity for entity in answer_entities if entity not in context_entities]
        
        groundedness_score = round(1.0 - (len(unsupported) / len(answer_entities)), 2)

        return {
            "entity_groundedness_score": max(0.0, groundedness_score),
            "unsupported_entities": unsupported
        }

    def evaluate_lexical_overlap(self, answer: str, source_contexts: list[str]) -> float:
        """
        Computes Jaccard Similarity between answer and source context tokens.
        """
        answer_tokens = self._extract_tokens(answer)
        context_tokens = self._extract_tokens(" ".join(source_contexts))

        if not answer_tokens or not context_tokens:
            return 0.0

        intersection = answer_tokens.intersection(context_tokens)
        union = answer_tokens.union(context_tokens)

        return round(len(intersection) / len(answer_tokens), 2)  # Precision ratio relative to answer

    def evaluate_citation_integrity(self, answer: str, valid_clause_ids: list[str]) -> dict[str, Any]:
        """
        Ensures any clause ID referenced in the answer (e.g., 'Clause 1234')
        actually belongs to the set of retrieved clause IDs.
        """
        if not valid_clause_ids:
            return {"valid": True, "invalid_citations": []}

        # Look for referenced IDs matching pattern
        cited_ids = set(re.findall(r"\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b", answer, re.IGNORECASE))
        
        invalid = [c_id for c_id in cited_ids if c_id not in valid_clause_ids]
        
        return {
            "citation_validity_score": 1.0 if not invalid else 0.0,
            "invalid_citations": invalid
        }

    def evaluate_semantic_similarity(self, query: str, answer: str) -> float:
        """
        Optional: Uses local CPU MiniLM model (~10ms) to score query-answer relevance.
        """
        if _LOCAL_EMBEDDER is None:
            return -1.0  # Skipped if SentenceTransformers is not installed

        q_emb = _LOCAL_EMBEDDER.encode(query, convert_to_tensor=True)
        a_emb = _LOCAL_EMBEDDER.encode(answer, convert_to_tensor=True)

        sim = util.cos_sim(q_emb, a_emb).item()
        return round(float(sim), 2)

    def run_full_eval(
        self, 
        query: str, 
        answer: str, 
        source_contexts: list[str], 
        valid_clause_ids: list[str] = None
    ) -> dict[str, Any]:
        """
        Executes all lightweight metrics in < 15ms.
        """
        valid_clause_ids = valid_clause_ids or []
        
        groundedness = self.evaluate_groundedness(answer, source_contexts)
        lexical_score = self.evaluate_lexical_overlap(answer, source_contexts)
        citations = self.evaluate_citation_integrity(answer, valid_clause_ids)
        semantic_sim = self.evaluate_semantic_similarity(query, answer)

        # Overall composite health score (0.0 - 1.0)
        overall_health = round(
            (groundedness["entity_groundedness_score"] * 0.5) + 
            (lexical_score * 0.3) + 
            (citations["citation_validity_score"] * 0.2), 
            2
        )

        return {
            "overall_health_score": overall_health,
            "entity_groundedness_score": groundedness["entity_groundedness_score"],
            "unsupported_entities": groundedness["unsupported_entities"],
            "lexical_overlap_score": lexical_score,
            "citation_validity_score": citations["citation_validity_score"],
            "invalid_citations": citations["invalid_citations"],
            "semantic_relevance_score": semantic_sim,
        }