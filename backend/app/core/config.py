import os

class Settings:
    PROJECT_NAME: str = "VivaMate Backend API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ALLOW_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "mock-key")
    USE_MOCK_AI: bool = os.getenv("USE_MOCK_AI", "true").lower() == "true"

settings = Settings()
