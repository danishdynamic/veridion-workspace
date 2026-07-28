import asyncio
import time
from collections import deque
from typing import Any, Dict

from fastapi import HTTPException
from google import genai

from app.core.config import settings


class GeminiMetricsMonitor:
    def __init__(self):
        # Global client re-uses connection pool initialized in settings
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # Rolling window records for 60-second window
        self.request_timestamps = deque()
        self.token_records = deque()  # Tuples of (timestamp, token_count)

        # Limits sourced from application configuration
        self.max_rpm = settings.GEMINI_MAX_RPM
        self.max_tpm = settings.GEMINI_MAX_TPM

        # All-time peak tracking
        self.peak_rpm = 0
        self.peak_tpm = 0

        # Async lock to ensure thread safety on in-memory sliding windows
        self._lock = asyncio.Lock()

    def _clear_expired(self, current_time: float) -> None:
        """Removes records older than 60 seconds."""
        cutoff = current_time - 60.0

        while self.request_timestamps and self.request_timestamps[0] < cutoff:
            self.request_timestamps.popleft()

        while self.token_records and self.token_records[0][0] < cutoff:
            self.token_records.popleft()

    async def track_request(self, model: str, prompt: str) -> None:
        """
        Asynchronously checks rate limits, counts input tokens, 
        and records rolling window metrics.
        """
        current_time = time.time()

        # 1. Non-blocking token counting via aio interface
        try:
            response = await self.client.aio.models.count_tokens(
                model=model,
                contents=prompt
            )
            token_count = response.total_tokens or (len(prompt) // 4)
        except Exception:
            # Fallback estimation if count_tokens API call fails
            token_count = max(1, len(prompt) // 4)

        async with self._lock:
            # 2. First slide window to remove expired records
            self._clear_expired(current_time)

            current_rpm = len(self.request_timestamps)
            current_tpm = sum(tokens for _, tokens in self.token_records)

            # 3. Check rate limits against active sliding window BEFORE recording new request
            if current_rpm >= self.max_rpm:
                raise HTTPException(
                    status_code=429, 
                    detail=f"Gemini RPM limit exceeded ({current_rpm}/{self.max_rpm})"
                )

            if current_tpm + token_count > self.max_tpm:
                raise HTTPException(
                    status_code=429, 
                    detail=f"Gemini TPM limit exceeded ({current_tpm + token_count}/{self.max_tpm})"
                )

            # 4. Append current request to window
            self.request_timestamps.append(current_time)
            self.token_records.append((current_time, token_count))

            # 5. Update running totals & peaks
            new_rpm = len(self.request_timestamps)
            new_tpm = current_tpm + token_count

            if new_rpm > self.peak_rpm:
                self.peak_rpm = new_rpm
            if new_tpm > self.peak_tpm:
                self.peak_tpm = new_tpm

    async def get_metrics(self) -> Dict[str, Any]:
        """Returns current and peak usage stats asynchronously."""
        current_time = time.time()

        async with self._lock:
            self._clear_expired(current_time)

            current_rpm = len(self.request_timestamps)
            current_tpm = sum(tokens for _, tokens in self.token_records)

            return {
                "current_rpm": current_rpm,
                "current_tpm": current_tpm,
                "peak_rpm": self.peak_rpm,
                "peak_tpm": self.peak_tpm,
                "max_rpm_limit": self.max_rpm,
                "max_tpm_limit": self.max_tpm,
                "exceeded_rpm_limit": current_rpm >= self.max_rpm,
                "exceeded_tpm_limit": current_tpm >= self.max_tpm,
            }


# Global singleton instance
metrics_monitor = GeminiMetricsMonitor()