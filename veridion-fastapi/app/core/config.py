# core/config.py
import os
from typing import Optional, List
from pydantic import Field, PostgresDsn, RedisDsn, field_validator,TypeAdapter
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Read variables from the system environment or a local file
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    PROJECT_NAME: str = "Veridion Flow Backend"
    ENVIRONMENT: str = "development"
    PORT: int = 8000

    CORS_ORIGINS: List[str] = []

    # Database Settings: Enforce strong DSN validation at initialization boundary
    DATABASE_URL: PostgresDsn
    ASYNC_DATABASE_URL: Optional[PostgresDsn] = None

    # Redis Cache Settings: Upgraded to RedisDsn for automatic connection string safety checking
    REDIS_URL: RedisDsn = TypeAdapter(RedisDsn).validate_python("redis://localhost:6379/0")

    # LLM Settings
    GEMINI_API_KEY: str = Field(..., min_length=1)
    EMBEDDING_MODEL: str = "text-embedding-004"

    @field_validator("ASYNC_DATABASE_URL", mode="before")
    @classmethod
    def assemble_async_db_url(cls, v: Optional[str], info):
        """
        Intercepts the standard thread-blocked 'postgresql://' driver schema 
        and safely converts it into the async 'postgresql+asyncpg://' driver structure.
        """
        raw_url = info.data.get("DATABASE_URL")
        if not raw_url:
            raise ValueError("DATABASE_URL must be specified before assembling ASYNC_DATABASE_URL")
        
        # Coerce standard PostgresDsn objects to strings to execute replacing transformations
        str_url = str(raw_url)
        
        if str_url.startswith("postgresql://"):
            computed_url = str_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif str_url.startswith("postgresql+asyncpg://"):
            computed_url = str_url
        else:
            raise ValueError("DATABASE_URL schema must begin with 'postgresql://'")
            
        # Fixed: We return the string, but we remove the 'str' return type annotation from the def.
        # Pydantic will automatically parse this returned string into a valid PostgresDsn instance.
        return computed_url


settings = Settings()