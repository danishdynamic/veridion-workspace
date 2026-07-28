import hashlib
from typing import List, Optional, cast

import redis.asyncio as aioredis

from app.core.config import settings


class KVCacheService:
    def __init__(self):
        # Pointing to the shared Redis instance
        self.redis = aioredis.from_url(str(settings.REDIS_URL), decode_responses=True)
        self.ttl = 3600  # 1 hour cache lifespan for active context windows

    def _generate_context_hash(
        self,
        chunk_ids: list[str],
        query: str,
        model: str = "gemini-2.5-flash",
        prompt_version: str = "v1.0",
        version: str = "v1",
    ) -> str:
        """
        Creates a deterministic hash representing the exact context, query,
        model architecture, system prompt iteration, and pipeline version.
        """
        # Ensure deterministic hash order for chunk_ids
        sorted_ids = ",".join(sorted(chunk_ids))
        
        # Combine all execution parameters that influence output generation
        serialized_context = f"{sorted_ids}:{query}:{model}:{prompt_version}:{version}"
        return hashlib.sha256(serialized_context.encode("utf-8")).hexdigest()

    async def get_cached_inference(
        self,
        chunk_ids: list[str],
        query: str,
        model: str = "gemini-2.5-flash",
        prompt_version: str = "v1.0",
        version: str = "v1",
    ) -> str | None:
        """Checks if this exact context & pipeline state has a cached model response."""
        cache_key = f"kv_cache:{self._generate_context_hash(chunk_ids, query, model, prompt_version, version)}"
        try:
            raw_value = await self.redis.get(cache_key)

            if isinstance(raw_value, bytes):
                return raw_value.decode("utf-8")
            return cast(str | None, raw_value)

        except Exception as e:
            print(f"[KVCache] Redis read error: {e}")
            return None

    async def set_cached_inference(
        self,
        chunk_ids: list[str],
        query: str,
        response_text: str,
        model: str = "gemini-2.5-flash",
        prompt_version: str = "v1.0",
        version: str = "v1",
    ) -> None:
        """Saves the generation output tied to this specific pipeline execution hash."""
        cache_key = f"kv_cache:{self._generate_context_hash(chunk_ids, query, model, prompt_version, version)}"
        try:
            await self.redis.setex(cache_key, self.ttl, response_text)
        except Exception as e:
            print(f"[KVCache] Redis write error: {e}")


kv_cache = KVCacheService()