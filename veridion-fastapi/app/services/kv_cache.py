#services/kv_cacahe
import hashlib
from typing import Optional, List, cast
import redis.asyncio as aioredis
from app.core.config import settings

class KVCacheService:
    def __init__(self):
        # Pointing to the shared Redis instance
        self.redis = aioredis.from_url(str(settings.REDIS_URL), decode_responses=True)
        self.ttl = 3600  # 1 hour cache lifespan for active context windows

    def _generate_context_hash(self, chunk_ids: List[str], query: str) -> str:
        """
        Creates a deterministic hash representing the exact 
        retrieved document context combined with the system prompt.
        """
        serialized_context = f"{','.join(sorted(chunk_ids))}:{query}"
        return hashlib.sha256(serialized_context.encode('utf-8')).hexdigest()

    async def get_cached_inference(self, chunk_ids: List[str], query: str) -> Optional[str]:
        """Checks if this exact context state has a cached model response."""
        cache_key = f"kv_cache:{self._generate_context_hash(chunk_ids, query)}"
        try:
            raw_value = await self.redis.get(cache_key)
            
            # Fix: Explicitly cast or narrow the type to satisfy the static compiler
            if isinstance(raw_value, bytes):
                return raw_value.decode('utf-8')
            return cast(Optional[str], raw_value)
            
        except Exception as e:
            print(f"[KVCache] Redis read error: {e}")
            return None

    async def set_cached_inference(self, chunk_ids: List[str], query: str, response_text: str) -> None:
        """Saves the generation output tied to this specific context hash."""
        cache_key = f"kv_cache:{self._generate_context_hash(chunk_ids, query)}"
        try:
            await self.redis.setex(cache_key, self.ttl, response_text)
        except Exception as e:
            print(f"[KVCache] Redis write error: {e}")

kv_cache = KVCacheService()