# app/main.py
from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine, Base

# Importing models ensures they are fully registered on Base.metadata before create_all runs
import app.models
from app.api.v1.ingest import router as ingest_router
from app.api.v1.retrieve import router as retrieve_router
from app.metrics.metrics import metrics_monitor

# Configure granular log outputs for infrastructure tracking
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

    # 1. Execute Startup Health Probe & Dynamic Schema Creation
    try:
        async with engine.begin() as conn:
            # A. First, explicitly ensure the pgvector extension is activated in this database instance
            logger.info(
                "Probing database layer connectivity and configuring extensions..."
            )
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))

            # B. Verify that the pgvector extension is compiled and ready (this will now pass!)
            logger.info("Verifying pgvector extension availability...")
            await conn.execute(text("SELECT '[1, 2, 3]'::vector;"))

            # C. Dynamically build out the application table spaces directly from the Python models
            logger.info("Auto-generating database tables from SQLAlchemy models...")
            await conn.run_sync(Base.metadata.create_all)

        logger.info(
            "Database validation successful. All extensions and models operational."
        )

    except Exception as e:
        logger.critical(f"FATAL: Database boot probe failed: {str(e)}")
        # Prevent the server from running in a broken state
        raise SystemExit("Infrastructure connectivity failure. Aborting startup.")

    yield

    # 2. Shutdown Phase
    logger.info("Tearing down service dependencies... Disposing connection pools.")
    await engine.dispose()
    logger.info("Veridion Engine shutdown complete.")


# Initialize FastAPI with metadata and our custom lifespan manager
app = FastAPI(
    title="Veridion Flow Core Routing Engine",
    description="Asynchronous Hybrid Vector Search and Legislative Audit Substrate Middleware.",
    version="1.0.0",
    lifespan=lifespan,
)

# 3. Secure Cross-Origin Resource Sharing (CORS) Topography Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)


# 4. Global Core Infrastructure Health Target
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Infrastructure"])
async def system_health_check():
    """Standard heartbeat health validation endpoint for load balancers."""
    return {
        "status": "healthy",
        "engine_state": "operational",
        "active_profiles": ["pgvector", "hybrid_jsonb_filter"],
    }


@app.get("/metrics", tags=["Infrastructure"])
async def get_llm_metrics():
    """Endpoint to inspect real-time RPM, TPM, and peak spikes."""
    return metrics_monitor.get_metrics()


# 5. Mount API Module Router Architectures
app.include_router(ingest_router, prefix="/api/v1/ingest", tags=["Ingestion Subsystem"])
app.include_router(
    retrieve_router, prefix="/api/v1/retrieve", tags=["Retrieval Subsystem"]
)
