import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.job import ProcessingJob
from app.services.storage_service import storage_service

router = APIRouter()

@router.get("/{job_id}/status")
async def get_job_status(job_id: str, db: AsyncSession = Depends(get_db)):
    """Returns real-time processing status and metadata for a job."""
    stmt = select(ProcessingJob).where(ProcessingJob.id == job_id)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=404, detail="Job not found or has expired.")

    download_url = f"/api/v1/jobs/download/{job.download_token}" if job.download_token else None
    savings_percent = 0.0
    if job.input_file_size > 0 and job.output_file_size > 0:
        if job.output_file_size < job.input_file_size:
            savings_percent = round(((job.input_file_size - job.output_file_size) / job.input_file_size) * 100, 1)

    return {
        "job_id": job.id,
        "tool_name": job.tool_name,
        "status": job.status,
        "download_url": download_url,
        "output_filename": job.output_filename,
        "input_file_size": job.input_file_size,
        "output_file_size": job.output_file_size,
        "processing_time": job.processing_time,
        "savings_percent": savings_percent,
        "error_message": job.error_message,
        "expires_at": job.expires_at.isoformat() if job.expires_at else None,
    }

@router.get("/download/{token}")
async def download_processed_file(token: str, db: AsyncSession = Depends(get_db)):
    """
    Secure short-lived download endpoint using unguessable token.
    Zero permanent storage: downloads the temporary file with appropriate MIME type.
    """
    stmt = select(ProcessingJob).where(ProcessingJob.download_token == token)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=404, detail="Download link is invalid or has expired.")

    # Locate output file in job's directory
    job_dir = storage_service.get_job_dir(job.id)
    out_files = list(job_dir.glob("out_*"))

    if not out_files or not out_files[0].exists():
        raise HTTPException(status_code=404, detail="File has expired and was automatically cleaned up.")

    file_to_send = out_files[0]
    filename = job.output_filename or file_to_send.name
    media_type = job.output_mime or "application/octet-stream"

    return FileResponse(
        path=str(file_to_send),
        filename=filename,
        media_type=media_type
    )
