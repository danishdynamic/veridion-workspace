#evaluation/ragas_eval.py
from typing import List, Dict
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevance, context_utilization
from ragas.dataset_schema import EvaluationResult
from langchain_openai import ChatOpenAI, OpenAIEmbeddings

class RagasEvaluator:
    def __init__(self):
        # Bind explicit LangChain LLM instances required by the Ragas computational framework
        self.evaluator_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)
        self.evaluator_embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    async def compute_pipeline_metrics(
        self, 
        query: str, 
        generated_response: str, 
        retrieved_contexts: List[str]
    ) -> Dict[str, float]:
        """
        Calculates standardized engineering performance scores for telemetry monitoring.
        """
        # Format transactional datasets array
        data = {
            "question": [query],
            "answer": [generated_response],
            "contexts": [retrieved_contexts],
        }
        
        dataset = Dataset.from_dict(data)
        
        # Execute batch computational assessment scoring matrix
        score_result = evaluate(
            dataset=dataset,
            metrics=[faithfulness, answer_relevance, context_utilization],
            llm=self.evaluator_llm,
            embeddings=self.evaluator_embeddings
        )

        if not isinstance(score_result, EvaluationResult):
            raise TypeError("Ragas evaluation did not return a valid EvaluationResult object.")

        # Fix 2: Index the first element [0] because Ragas returns a list of scores per row
        return {
            "faithfulness_score": float(score_result["faithfulness"][0]),
            "answer_relevance_score": float(score_result["answer_relevance"][0]),
            "context_utilization_score": float(score_result["context_utilization"][0])
        }