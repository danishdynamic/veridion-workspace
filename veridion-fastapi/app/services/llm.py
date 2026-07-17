# services/llm.py
import logging
from google import genai


logger = logging.getLogger("veridion_llm_service")

async def generate_response(prompt: str, model: str = "gemini-2.5-flash") -> str:
    """
    Dispatches an asynchronous generative context request to the Gemini API fabric.
    """
    try:
        # Initializing the modern async client instance (reads GEMINI_API_KEY from env automatically)
        async with genai.Client().aio as aclient:
            logger.info(f"Dispatching inference vector stream using model: {model}")
            
            response = await aclient.models.generate_content(
                model=model,
                contents=prompt
            )
            
            # Fixed: Check response safety constraints and guarantee a solid 'str' return type
            if not response.text:
                raise ValueError("Gemini API returned an empty response text payload or was blocked.")
                
            return response.text
            
    except Exception as e:
        logger.error(f"LLM Generation substrate failure: {str(e)}")
        raise RuntimeError(f"Failed to generate text response: {str(e)}")