#core/database.py
from typing import AsyncGenerator, cast
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# 1. Ensure the URL is treated as a strict string, resolving the IDE type error
if not settings.ASYNC_DATABASE_URL:
    raise RuntimeError("ASYNC_DATABASE_URL was not initialized correctly by Pydantic.")

# Using 'cast' tells your IDE type checker that this value is strictly a str here
db_url = cast(str, settings.ASYNC_DATABASE_URL)

# 2. Initialize the engine pool (Renamed from async_engine to engine to match main.py)
engine = create_async_engine(
    str(settings.ASYNC_DATABASE_URL),
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
    echo=False
)

# 3. Bind the Async Session factory constructor
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# 4. Base class for declarative ORM models
class Base(DeclarativeBase):
    pass

# 5. Dependency function injected into API routes
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()