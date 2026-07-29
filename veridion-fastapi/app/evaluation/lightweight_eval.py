import re
from typing import Any

try:
    from sentence_transformers import SentenceTransformer, util as st_util
    _LOCAL_EMBEDDER = SentenceTransformer("all-MiniLM-L6-v2")
    _ST_UTIL = st_util
except ImportError:
    _LOCAL_EMBEDDER = None
    _ST_UTIL = None


class LightweightRAGEvaluator:
    """
    Sub-15ms, zero-external-LLM evaluation suite for online regulatory RAG telemetry.
    Runs locally on CPU without adding network latency or API costs.
    """

    NEGATION_WORDS = {"not", "never", "no", "prohibited", "neither", "nor", "exempt", "unauthorized"}

    @staticmethod
    def _extract_tokens(text: str) -> set[str]:
        return set(re.findall(r"\b\w+\b", text.lower()))

    @staticmethod
    def _extract_entities_and_numbers(text: str) -> set[str]:
        """
        Extracts numbers, percentages, dates, section references, and compliance terms.
        """
        # Numbers, percentages, dates, section numbers (e.g. "15%", "2026", "4.1")
        numbers_and_codes = set(re.findall(r"\b\d+(?:\.\d+)?%?\b", text))
        
        # Capitalized terms & acronyms (e.g., "GDPR", "Veridion", "Section")
        capitalized = set(re.findall(r"\b[A-Z][a-zA-Z0-9_-]+\b", text))
        
        # Section/Article patterns (e.g., "Sec. 4", "Article 12")
        regulatory_refs = set(re.findall(r"\b(?:Section|Sec\.|Article|Art\.|Clause)\s*\d+(?:\.\d+)*\b", text, re.IGNORECASE))

        return numbers_and_codes.union(capitalized).union(regulatory_refs)

    def evaluate_groundedness(self, answer: str, source_contexts: list[str]) -> dict[str, Any]:
        combined_context = " ".join(source_contexts)
        answer_entities = self._extract_entities_and_numbers(answer)
        context_entities = self._extract_entities_and_numbers(combined_context)

        if not answer_entities:
            return {"entity_groundedness_score": 1.0, "unsupported_entities": []}

        unsupported = [entity for entity in answer_entities if entity not in context_entities]
        groundedness_score = round(1.0 - (len(unsupported) / len(answer_entities)), 2)

        return {
            "entity_groundedness_score": max(0.0, groundedness_score),
            "unsupported_entities": unsupported
        }

    def evaluate_lexical_overlap(self, answer: str, source_contexts: list[str]) -> float:
        answer_tokens = self._extract_tokens(answer)
        context_tokens = self._extract_tokens(" ".join(source_contexts))

        if not answer_tokens or not context_tokens:
            return 0.0

        intersection = answer_tokens.intersection(context_tokens)
        return round(len(intersection) / len(answer_tokens), 2)  # Precision relative to generated answer

    def evaluate_citation_integrity(
        self, 
        answer: str, 
        valid_clause_ids: list[str],
        valid_sections: list[str] | None = None
    ) -> dict[str, Any]:
        """
        Validates both UUID clause citations and Section/Version citations.
        """
        invalid_citations = []
        
        # 1. Check Clause UUIDs
        if valid_clause_ids:
            cited_uuids = set(re.findall(r"\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b", answer, re.IGNORECASE))
            invalid_citations.extend([c_id for c_id in cited_uuids if c_id not in valid_clause_ids])

        # 2. Check Section / Version designations if provided
        if valid_sections:
            cited_sections = set(re.findall(r"\b(?:Section|Sec\.)\s*(\d+(?:\.\d+)*)\b", answer, re.IGNORECASE))
            invalid_citations.extend([sec for sec in cited_sections if sec not in valid_sections])

        return {
            "citation_validity_score": 1.0 if not invalid_citations else 0.0,
            "invalid_citations": invalid_citations
        }

    def detect_negation_risk(self, answer: str, source_contexts: list[str]) -> bool:
        """
        Flags potential hallucinated compliance flips where the answer contains 
        negation words absent in the source context (e.g. 'not', 'prohibited').
        """
        answer_negations = self._extract_tokens(answer).intersection(self.NEGATION_WORDS)
        context_negations = self._extract_tokens(" ".join(source_contexts)).intersection(self.NEGATION_WORDS)

        # High risk if answer relies on negative constraints not present in the retrieved source
        return len(answer_negations - context_negations) > 0

    def evaluate_semantic_similarity(self, query: str, answer: str) -> float:
        if _LOCAL_EMBEDDER is None or _ST_UTIL is None:
            return -1.0

        q_emb = _LOCAL_EMBEDDER.encode(query, convert_to_tensor=True)
        a_emb = _LOCAL_EMBEDDER.encode(answer, convert_to_tensor=True)

        sim = _ST_UTIL.cos_sim(q_emb, a_emb).item()
        return round(float(sim), 2)

    def run_full_eval(
        self, 
        query: str, 
        answer: str, 
        source_contexts: list[str], 
        valid_clause_ids: list[str] | None = None,
        valid_sections: list[str] | None = None
    ) -> dict[str, Any]:
        valid_clause_ids = valid_clause_ids or []
        valid_sections = valid_sections or []

        groundedness = self.evaluate_groundedness(answer, source_contexts)
        lexical_score = self.evaluate_lexical_overlap(answer, source_contexts)
        citations = self.evaluate_citation_integrity(answer, valid_clause_ids, valid_sections)
        semantic_sim = self.evaluate_semantic_similarity(query, answer)
        negation_risk = self.detect_negation_risk(answer, source_contexts)

        # Deduct health score if negation risk is detected
        base_health = (
            (groundedness["entity_groundedness_score"] * 0.5) + 
            (lexical_score * 0.3) + 
            (citations["citation_validity_score"] * 0.2)
        )
        if negation_risk:
            base_health -= 0.15

        return {
            "overall_health_score": max(0.0, round(base_health, 2)),
            "entity_groundedness_score": groundedness["entity_groundedness_score"],
            "unsupported_entities": groundedness["unsupported_entities"],
            "lexical_overlap_score": lexical_score,
            "citation_validity_score": citations["citation_validity_score"],
            "invalid_citations": citations["invalid_citations"],
            "semantic_relevance_score": semantic_sim,
            "negation_risk_flag": negation_risk,
        }