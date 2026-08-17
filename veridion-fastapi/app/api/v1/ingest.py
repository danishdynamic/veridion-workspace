import io
import uuid
from datetime import datetime

import pypdf
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.clause import Clause
from app.models.document import DocumentParent
from app.models.section import DocumentSection
from app.models.version import DocumentVersion

router = APIRouter()


def simple_text_splitter(text_content: str, chunk_size: int = 500) -> list[str]:
    """Splits raw text down into paragraph-sized readable segments."""
    paragraphs = text_content.split("\n\n")
    chunks = []
    current_chunk = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        if len(current_chunk) + len(para) < chunk_size:
            current_chunk += para + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = para + "\n\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_and_version_document(
    title: str = Form(...),
    version_tag: str = Form(..., alias="versionTag"),
    sector: str = Form(...),
    region: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Ingests PDFs/TXTs, builds/retrieves top-level Document, attaches a DocumentVersion
    with JSON metadata (sector, region), and creates corresponding Sections and Clauses.
    """
    filename = (file.filename or "").lower()

    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file upload metadata: The uploaded file is missing a valid filename attribute.",
        )

    raw_text = ""

    # 1. Parse File Content
    try:
        if filename.endswith(".txt"):
            content = await file.read()
            raw_text = content.decode("utf-8")
        elif filename.endswith(".pdf"):
            content = await file.read()
            pdf_stream = io.BytesIO(content)
            reader = pypdf.PdfReader(pdf_stream)
            raw_text = "\n".join(
                [page.extract_text() for page in reader.pages if page.extract_text()]
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported format. Only .txt and .pdf formats are permitted.",
            )

        if not raw_text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Document text extraction yielded zero characters.",
            )

        # 2. Open atomic database transaction block
        async with db.begin():
            # Check if parent Document exists by title, or create a new one
            stmt = select(DocumentParent).where(DocumentParent.title == title)
            result = await db.execute(stmt)
            document = result.scalar_one_or_none()

            if not document:
                document = DocumentParent(
                    id=str(uuid.uuid4()),
                    title=title,
                )
                db.add(document)
                await db.flush()  # Flush to generate ID for relationship reference

            # Unmark previous versions as 'is_latest' if a new version is uploaded
            existing_versions_stmt = select(DocumentVersion).where(
                DocumentVersion.document_id == document.id,
                DocumentVersion.is_latest == True,  
            )
            latest_versions = (await db.execute(existing_versions_stmt)).scalars().all()
            for v in latest_versions:
                v.is_latest = False

            # Create new DocumentVersion entry with JSON metadata mapping
            version = DocumentVersion(
                id=str(uuid.uuid4()),
                document_id=document.id,
                version_number=version_tag,
                effective_date=datetime.now(),
                is_latest=True,
                metadata_json={
                    "sector": sector,
                    "region": region,
                    "original_filename": file.filename,
                },
            )
            db.add(version)
            await db.flush()

            # 3. Process text into Sections and nested Clauses
            text_chunks = simple_text_splitter(raw_text)
            mock_vector = [0.15, -0.23, 0.88] + [0.0] * 765  # Standard 768-dim vector text-embedding-004

            total_clauses = 0
            for idx, chunk_text in enumerate(text_chunks, start=1):
                # Create parent Section entry for vector retrieval
                section = DocumentSection(
                    id=str(uuid.uuid4()),
                    version_id=version.id,
                    part_number=idx,
                    heading=f"Section {idx}",
                    section_text=chunk_text,
                    embedding=mock_vector,  # Replace with actual embedding service call
                )
                db.add(section)
                await db.flush()

                # Map individual paragraph/clause unit under the section
                clause = Clause(
                    id=str(uuid.uuid4()),
                    section_id=section.id,
                    clause_number=f"{idx}.1",
                    sequence_order=1,
                    clause_text=chunk_text,
                    embedding=mock_vector,
                )
                db.add(clause)
                total_clauses += 1

        return {
            "status": "success",
            "message": f"Successfully ingested '{title}' ({version_tag}).",
            "document_id": document.id,
            "version_id": version.id,
            "sections_created": len(text_chunks),
            "clauses_created": total_clauses,
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database write execution anomaly: {str(e)}",
        )