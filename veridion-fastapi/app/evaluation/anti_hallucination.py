import json
from typing import Any

from google import genai
from google.genai import types
from pydantic import BaseModel
from app.core.config import settings

class HallucinationReport(BaseModel):
    is_hallucinated: bool
    unsupported_claims: list[str]


class AntiHallucinationGuardrail:
    def __init__(self):
        # Uses standard GEMINI_API_KEY from environment variables
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    async def verify_alignment(
        self, generated_answer: str, source_contexts: list[str]
    ) -> dict[str, Any]:
        """
        Cross-examines the synthesized answer against retrieved source contexts 
        using Gemini structured outputs.
        """
        if not source_contexts:
            return {
                "is_hallucinated": True,
                "unsupported_claims": ["No source contexts were provided for verification."],
            }

        combined_context = "\n\n".join(
            [f"[Source Context {i+1}]: {c}" for i, c in enumerate(source_contexts)]
        )

        prompt = (
            f"You are a strict, automated NLI (Natural Language Inference) compliance judge.\n"
            f"Your task is to verify if the 'Generated Answer' is fully supported by the provided 'Source Contexts'.\n\n"
            f"--- START SOURCE CONTEXTS ---\n{combined_context}\n--- END SOURCE CONTEXTS ---\n\n"
            f"--- START GENERATED ANSWER ---\n{generated_answer}\n--- END GENERATED ANSWER ---\n\n"
            f"Analyze every factual claim in the Generated Answer. If any statement or inference is not strictly "
            f"supported by or provable from the Source Contexts, flag it as a hallucination."
        )

        try:
            # Dispatch async request utilizing structured Pydantic schema response format
            response = await self.client.aio.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=HallucinationReport,
                    temperature=0.0,
                ),
            )

            content_str = response.text or '{"is_hallucinated": false, "unsupported_claims": []}'
            return json.loads(content_str)

        except Exception as e:
            # Fail closed: treat execution errors as flagged for manual safety review
            return {
                "is_hallucinated": True,
                "unsupported_claims": [f"Guardrail execution engine failure: {str(e)}"],
            }