# app/services/rewriter.py
import logging
from google import genai

logger = logging.getLogger("veridion_rewriter_service")

class ComplianceQueryRewriter:
    async def generate_hyde_document(self, query: str, sector: str, region: str) -> str:
        """
        Generates a hypothetical regulatory compliance paragraph to improve
        dense vector retrieval metrics via semantic alignment (HyDE).
        """
        prompt = (
            f"You are an expert regulatory compliance officer specialized in the {sector} sector within the {region} region.\n"
            f"Write a hypothetical paragraph from an official regulatory framework or audit guideline that directly addresses "
            f"the following compliance concern or query: '{query}'.\n"
            f"Respond ONLY with the technical text paragraph. Do not say 'Here is the paragraph' or add conversational fluff."
        )

        try:
            # Using the modern native async client instance (reads GEMINI_API_KEY from env automatically)
            async with genai.Client().aio as aclient:
                response = await aclient.models.generate_content(
                    model="gemini-2.5-flash",  # Fast, highly cost-efficient text expansion substrate
                    contents=prompt
                )
                
                # Fixed: Type guard to ensure content text exists before manipulating it
                if not response.text:
                    raise ValueError("Gemini API returned an empty text payload during HyDE expansion.")
                    
                return response.text.strip()
                
        except Exception as e:
            logger.error(f"HyDE query rewriting phase failed: {str(e)}")
            raise RuntimeError(f"Query rewriter failure: {str(e)}")