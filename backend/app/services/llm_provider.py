import json
import os
import urllib.request
from typing import Dict, Any, Optional

class BaseLLMProvider:
    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        raise NotImplementedError

class GeminiLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": f"{system_prompt}\n\nUSER REQUEST:\n{user_prompt}"}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 0.3,
                "responseMimeType": "application/json"
            }
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = json.loads(response.read().decode("utf-8"))
            return res_body["candidates"][0]["content"]["parts"][0]["text"]

class FallbackMockLLMProvider(BaseLLMProvider):
    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        # Intelligently evaluate user prompt text to create realistic structured JSON response
        prompt_lower = user_prompt.lower()
        ans_length = len(user_prompt)

        score = 8 if ans_length > 60 else (6 if ans_length > 25 else 4)
        if "because" in prompt_lower or "mechanism" in prompt_lower or "tradeoff" in prompt_lower:
            score = min(10, score + 1)

        diff_adj = "same"
        if score >= 9:
            diff_adj = "harder"
        elif score <= 4:
            diff_adj = "easier"

        missing = []
        if score < 8:
            missing = ["Formal mathematical bounds", "Boundary edge cases"]
        else:
            missing = ["Production scale trade-offs"]

        follow_up = "Can you elaborate on how this handles concurrency or failure states?"

        res = {
            "score": score,
            "accuracy": min(10, score + 1),
            "clarity": score,
            "understanding": max(1, score - 1),
            "feedback": f"Your answer demonstrated a score of {score}/10. You explained the main concepts effectively.",
            "missing_concepts": missing,
            "follow_up_question": follow_up,
            "difficulty_adjustment": diff_adj
        }
        return json.dumps(res)

def get_llm_provider() -> BaseLLMProvider:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
    if api_key and api_key != "mock-key":
        try:
            return GeminiLLMProvider(api_key=api_key)
        except Exception:
            return FallbackMockLLMProvider()
    return FallbackMockLLMProvider()
