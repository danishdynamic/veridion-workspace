from typing import List, Dict, Any
from flashrank import Ranker, RerankRequest

class ComplianceReranker:
    def __init__(self):
        # Initializes a lightweight, local cross-encoder model that executes inside the CPU/GPU container layer
        self.ranker = Ranker(model_name="ms-marco-MiniLM-L-12-v2", cache_dir="/tmp/flashrank")

    def rerank_contexts(self, query: str, raw_results: List[Dict[str, Any]], top_n: int = 4) -> List[Dict[str, Any]]:
        """
        Re-scores raw pgvector outputs based on cross-attention token alignment.
        """
        if not raw_results:
            return []

        # Format input matrices to match FlashRank's structural payload requirements
        passages = [
            {
                "id": idx,
                "text": result["legal_context_chunk"],
                "meta": result
            }
            for idx, result in enumerate(raw_results)
        ]

        rerank_request = RerankRequest(query=query, passages=passages)
        reranked_output = self.ranker.rerank(rerank_request)

        # Re-sort and slice down to the absolute highest-scoring contextual matches
        final_results = []
        for rank_item in reranked_output[:top_n]:
            source_metadata = rank_item["meta"]
            # Inject updated cross-encoder scores directly back into the trace dict
            source_metadata["rerank_score"] = float(rank_item["score"])
            final_results.append(source_metadata)

        return final_results