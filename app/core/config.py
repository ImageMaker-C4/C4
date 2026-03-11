from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Image Generation API"
    OPENAI_API_KEY: Optional[str] = None
    REPLICATE_API_TOKEN: Optional[str] = None
    DATABASE_URL: Optional[str] = None
    S3_BUCKET_NAME: Optional[str] = None

    class Config:
        env_file = ".env"

settings = Settings()
