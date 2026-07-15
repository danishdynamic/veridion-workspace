import time
from collections import deque
from google import genai
import os
from fastapi import HTTPException
from app.core.config import settings

class GeminiMetricsMonitor:
    def __init__(self):
        # Initialize the official unified GenAI Client 
        # (It automatically picks up the GEMINI_API_KEY environment variable)
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # Rolling windows for the last 60 seconds
        self.request_timestamps = deque()
        self.token_records = deque()  # stores tuples of (timestamp, token_count)
        
        # All-time peak tracking
        self.peak_rpm = 0
        self.peak_tpm = 0

    def _clear_expired(self, current_time: float):
        """Remove records older than 60 seconds."""
        cutoff = current_time - 60.0
        
        while self.request_timestamps and self.request_timestamps[0] < cutoff:
            self.request_timestamps.popleft()
            
        while self.token_records and self.token_records[0][0] < cutoff:
            self.token_records.popleft()

    def track_request(self, model: str, prompt: str):
        """Counts input tokens using Gemini API and updates metrics."""
        current_time = time.time()
        
        # 1. Count tokens using the new Client SDK method
        try:
            # Replaced legacy genai.GenerativeModel setup with the new client call
            response = self.client.models.count_tokens(
                model=model,
                contents=prompt
            )
            token_count = response.total_tokens
        except Exception:
            # Fallback estimation if the API call fails (approx 4 chars per token)
            token_count = len(prompt) // 4 

        # 2. Append to rolling window
        self.request_timestamps.append(current_time)
        self.token_records.append((current_time, token_count))

        self.max_rpm = int(os.getenv("GEMINI_MAX_RPM", 60))
        self.max_tpm = int(os.getenv("GEMINI_MAX_TPM", 40000))

        if len(self.request_timestamps) >= self.max_rpm:
           raise HTTPException(status_code=429, detail="Gemini RPM limit exceeded")
        
        # 3. Slide window
        self._clear_expired(current_time)
        
        # 4. Calculate current values
        current_rpm = len(self.request_timestamps)
        current_tpm = sum(tokens for _, tokens in self.token_records)
        
        # 5. Update all-time peaks
        if current_rpm > self.peak_rpm:
            self.peak_rpm = current_rpm
        if current_tpm > self.peak_tpm:
            self.peak_tpm = current_tpm

    def get_metrics(self):
        """Returns current and peak usage stats."""
        current_time = time.time()
        self._clear_expired(current_time)

        current_rpm = len(self.request_timestamps)
        current_tpm = sum(tokens for _, tokens in self.token_records)
        
        return {
            "current_rpm": current_rpm,
            "current_tpm": current_tpm,
            "peak_rpm": self.peak_rpm,
            "peak_tpm": self.peak_tpm,
            "exceeded_rpm_limit": current_rpm > self.max_rpm,
            "exceeded_tpm_limit": current_tpm > self.max_tpm
        }

# Global singleton instance to import across your app
metrics_monitor = GeminiMetricsMonitor()