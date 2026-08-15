# app/main.py
import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv


load_dotenv()

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
import app.models

from app.api.v1.ingest import router as ingest_router
from app.api.v1.retrieve import router as retrieve_router
from app.core.database import Base, engine
from app.metrics.metrics import metrics_monitor


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("veridion_bootloader")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles critical infrastructure initialization checks during application startup,
    registers database engines/extensions, and ensures resources are gracefully
    released upon system shutdown.
    """
    logger.info("Initializing Veridion Flow Engine Substrate Layer...")

    # Execute Startup Health Probe & Dynamic Schema Creation
    try:
        async with engine.begin() as conn:
            # A. Ensure the pgvector extension is enabled in PostgreSQL
            logger.info("Probing database layer connectivity and configuring extensions...")
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))

            # B. Verify pgvector extension compilation
            logger.info("Verifying pgvector extension availability...")
            await conn.execute(text("SELECT '[1, 2, 3]'::vector;"))

            # C. Dynamically generate schema tables from SQLAlchemy models
            logger.info("Auto-generating database tables from SQLAlchemy models...")
            await conn.run_sync(Base.metadata.create_all)

        logger.info("Database validation successful. All extensions and models operational.")

    except Exception as e:
        logger.critical(f"FATAL: Database boot probe failed: {str(e)}", exc_info=True)
        # Prevent server boot in degraded state
        raise SystemExit("Infrastructure connectivity failure. Aborting startup.") from e

    yield

    # Shutdown Phase
    logger.info("Tearing down service dependencies... Disposing database connection pools.")
    await engine.dispose()
    logger.info("Veridion Engine shutdown complete.")


# Initialize FastAPI instance
app = FastAPI(
    title="Veridion Flow Core Routing Engine",
    description="Asynchronous Hybrid Vector Search and Legislative Audit Substrate Middleware.",
    version="1.0.0",
    lifespan=lifespan,
)

# Secure Cross-Origin Resource Sharing (CORS) Configuration
cors_origins = [str(origin) for origin in settings.CORS_ORIGINS] if getattr(settings, "CORS_ORIGINS", None) else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)


# Infrastructure Monitoring Endpoints
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Infrastructure"])
async def system_health_check():
    """Live heartbeat validation endpoint checking DB engine status for load balancers."""
    db_status = "operational"
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1;"))
    except Exception:
        db_status = "degraded"

    return {
        "status": "healthy" if db_status == "operational" else "degraded",
        "database_state": db_status,
        "active_profiles": ["pgvector", "hybrid_jsonb_filter"],
    }


@app.get("/metrics", tags=["Infrastructure"])
async def get_llm_metrics():
    """Endpoint inspecting real-time RPM, TPM, peak spikes, and rate-limit states."""
    return await metrics_monitor.get_metrics()


# Mount Subsystem API Routers
app.include_router(ingest_router, prefix="/api/v1/ingest", tags=["Ingestion Subsystem"])
app.include_router(retrieve_router, prefix="/api/v1/retrieve", tags=["Retrieval Subsystem"])