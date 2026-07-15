# app/api/v1/ingest.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import pypdf
import io
import uuid
from typing import List

from app.core.database import get_db  

router = APIRouter()

def simple_text_splitter(text_content: str, chunk_size: int = 500) -> List[str]:
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
    version_tag: str = Form(...),
    sector: str = Form(...),
    region: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingests PDFs/TXTs, creates a specific document parent version entry,
    chunks the text, and maps the vector spaces directly into PostgreSQL.
    """
    filename = (file.filename or "").lower()

    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file upload metadata: The uploaded file missing a valid filename attribute."
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
            raw_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported format. Only .txt and .pdf file topography permitted."
            )

        if not raw_text.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Document text extraction yielded zero characters."
            )

        # 2. Open atomic database transaction block
        async with db.begin():
            # Create a brand new unique ID for this specific version entry
            parent_id = str(uuid.uuid4())
            
            # Insert the Parent Record tracking this specific version metadata
            parent_query = text("""
                INSERT INTO document_parents (id, title, version_tag, sector, region)
                VALUES (:id, :title, :version_tag, :sector, :region);
            """)
            await db.execute(parent_query, {
                "id": parent_id,
                "title": title,
                "version_tag": version_tag,
                "sector": sector,
                "region": region
            })

            # 3. Process the text chunks
            text_chunks = simple_text_splitter(raw_text)
            
            chunk_query = text("""
                INSERT INTO document_child_chunks (id, parent_id, chunk_index, text_content, embedding)
                VALUES (:id, :parent_id, :chunk_index, :text_content, :embedding::vector);
            """)

            for index, chunk_text in enumerate(text_chunks):
                chunk_id = str(uuid.uuid4())
                
                # NOTE: Replace this mock array with your actual embedding vector output
                # e.g., embedding = await embedding_client.get_embedding(chunk_text)
                mock_vector = str([0.15, -0.23, 0.88] + [0.0] * 1533)  # Matches standard 1536-dim shape
                
                await db.execute(chunk_query, {
                    "id": chunk_id,
                    "parent_id": parent_id,
                    "chunk_index": index,
                    "text_content": chunk_text,
                    "embedding": mock_vector
                })

        return {
            "status": "success",
            "message": f"Successfully committed '{title}' ({version_tag}) to structural storage.",
            "parent_id": parent_id,
            "total_chunks_indexed": len(text_chunks)
        }

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database write execution anomaly: {str(e)}"
        )