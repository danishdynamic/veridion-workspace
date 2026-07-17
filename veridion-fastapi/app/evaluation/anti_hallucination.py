# evaluation/anti_hallucination.py
import json
from typing import List, Dict, Any
from google import genai
from pydantic import BaseModel

# Define a Pydantic schema so Gemini forces the exact JSON structure we need
class HallucinationReport(BaseModel):
    is_hallucinated: bool
    unsupported_claims: List[str]

class AntiHallucinationGuardrail:
    def __init__(self):
        # The genai.Client() automatically picks up GEMINI_API_KEY from your environment variables
        self.client = genai.Client()

    async def verify_alignment(self, generated_answer: str, source_contexts: List[str]) -> Dict[str, Any]:
        """
        Cross-examines the agent's summary against original source segments 
        using Gemini structured outputs.
        """
        combined_context = "\n\n".join([f"[Source Context {i+1}]: {c}" for i, c in enumerate(source_contexts)])
        
        prompt = (
            f"You are a strict, automated NLI (Natural Language Inference) compliance judge.\n"
            f"Your task is to verify if the 'Generated Answer' is fully supported by the provided 'Source Contexts'.\n\n"
            f"--- START SOURCE CONTEXTS ---\n{combined_context}\n--- END SOURCE CONTEXTS ---\n\n"
            f"--- START GENERATED ANSWER ---\n{generated_answer}\n--- END GENERATED ANSWER ---\n\n"
            f"Analyze every factual claim in the Generated Answer. If any statement or inference is not strictly "
            f"provable from the Source Contexts, flag it as a hallucination."
        )

        try:
            # Dispatch async request utilizing the structured Pydantic schema response format
            response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": HallucinationReport,
                    "temperature": 0.0
                }
            )
            
            # Type safety fallback: ensure text is never None before running json.loads
            content_str = response.text or '{"is_hallucinated": false, "unsupported_claims": []}'
            return json.loads(content_str)
            
        except Exception as e:
            # Graceful fallback structure if network layers or JSON structural generation faults occur
            return {
                "is_hallucinated": True,
                "unsupported_claims": [f"Guardrail execution engine failure: {str(e)}"]
            }