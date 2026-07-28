# app/optimizer/reranker.py
import logging
from typing import Any, Dict, List, Optional

from flashrank import Ranker, RerankRequest

logger = logging.getLogger("veridion_reranker")


class ComplianceReranker:
    def __init__(self, model_name: str = "ms-marco-MiniLM-L-12-v2", cache_dir: str = "/tmp/flashrank"):
        """
        Initializes a lightweight cross-encoder model for CPU/GPU container layers.
        """
        self.ranker = Ranker(model_name=model_name, cache_dir=cache_dir)

    def rerank_contexts(
        self, query: str, raw_results: List[Dict[str, Any]], top_n: int = 4
    ) -> List[Dict[str, Any]]:
        """
        Re-scores raw pgvector/hybrid outputs using cross-attention alignment.
        """
        if not raw_results:
            return []

        passages = []
        for idx, result in enumerate(raw_results):
            # Compatible with 4-tier schema ('clause_text', 'text') and legacy keys ('legal_context_chunk')
            text_payload = (
                result.get("clause_text")
                or result.get("text")
                or result.get("legal_context_chunk")
                or ""
            )

            if not text_payload:
                logger.warning(f"Result index {idx} missing valid text payload for reranking.")
                continue

            passages.append({
                "id": idx,
                "text": text_payload,
                "meta": result
            })

        if not passages:
            return raw_results[:top_n]

        rerank_request = RerankRequest(query=query, passages=passages)
        reranked_output = self.ranker.rerank(rerank_request)

        final_results = []
        for rank_item in reranked_output[:top_n]:
            source_metadata = rank_item["meta"]
            source_metadata["rerank_score"] = float(rank_item["score"])
            final_results.append(source_metadata)

        return final_results