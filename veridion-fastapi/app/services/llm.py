# services/llm.py
import logging
from typing import Optional

from app.core.config import settings
from google import genai
from google.genai import types

logger = logging.getLogger("veridion_llm_service")

_client: Optional[genai.Client] = None


def get_genai_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return _client


async def generate_response(
    prompt: str,
    model: Optional[str] = None,
    temperature: float = 0.0,
    system_instruction: Optional[str] = None,
) -> str:
    """Dispatches an asynchronous generative request to the Gemini API fabric."""
    
    # Fall back to environment config if no model is explicitly passed
    active_model = model or settings.DEFAULT_MODEL
    client = get_genai_client()

    config = types.GenerateContentConfig(
        temperature=temperature,
        system_instruction=system_instruction,
    )

    try:
        logger.info(f"Dispatching inference vector stream using model: {active_model}")

        response = await client.aio.models.generate_content(
            model=active_model,
            contents=prompt,
            config=config,
        )

        if not response.text:
            raise ValueError("Gemini API returned an empty response text payload or was blocked.")

        return response.text

    except Exception as e:
        logger.error(f"LLM Generation substrate failure: {str(e)}", exc_info=True)
        raise RuntimeError(f"Failed to generate text response: {str(e)}") from e