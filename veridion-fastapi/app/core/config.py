# core/config.py
import os

from pydantic import Field, PostgresDsn, RedisDsn, TypeAdapter, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"
        ),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PROJECT_NAME: str = "Veridion Flow Backend"
    ENVIRONMENT: str = "development"
    PORT: int = 8000

    CORS_ORIGINS: list[str] = []

    # Database Settings
    DATABASE_URL: PostgresDsn
    ASYNC_DATABASE_URL: PostgresDsn | None = None

    # Redis Cache Settings
    REDIS_URL: RedisDsn = TypeAdapter(RedisDsn).validate_python(
        "redis://localhost:6379/0"
    )

    # LLM Settings
    GEMINI_API_KEY: str = Field(..., min_length=1)
    EMBEDDING_MODEL: str = "text-embedding-004"
    DEFAULT_MODEL: str = "gemini-2.5-flash"

    # Gemini Rate Limits
    GEMINI_MAX_RPM: int = 5
    GEMINI_MAX_TPM: int = 250

    @field_validator("ASYNC_DATABASE_URL", mode="before")
    @classmethod
    def assemble_async_db_url(cls, v: str | None, info):
        raw_url = info.data.get("DATABASE_URL")
        if not raw_url:
            raise ValueError(
                "DATABASE_URL must be specified before assembling ASYNC_DATABASE_URL"
            )

        str_url = str(raw_url)

        if str_url.startswith("postgresql://"):
            computed_url = str_url.replace(
                "postgresql://", "postgresql+asyncpg://", 1
            )
        elif str_url.startswith("postgresql+asyncpg://"):
            computed_url = str_url
        else:
            raise ValueError(
                "DATABASE_URL schema must begin with 'postgresql://'"
            )

        return computed_url


settings = Settings()