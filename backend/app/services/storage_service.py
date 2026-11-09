import os
import shutil
import uuid
from pathlib import Path
from typing import List, Tuple
from fastapi import UploadFile, HTTPException
from app.core.config import settings

class StorageService:
    def __init__(self):
        self.base_dir = Path(settings.TEMP_STORAGE_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def get_job_dir(self, job_id: str) -> Path:
        """Returns isolated directory for a job."""
        job_dir = self.base_dir / job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        return job_dir

    async def save_uploaded_files(self, job_id: str, files: List[UploadFile]) -> List[Tuple[str, Path, int]]:
        """
        Saves uploaded files safely inside job's isolated folder with UUID filenames.
        Returns list of (original_filename, absolute_path, file_size).
        """
        job_dir = self.get_job_dir(job_id)
        saved_files = []

        for file in files:
            # Validate extension and sanitize
            orig_name = file.filename or "uploaded_file"
            ext = Path(orig_name).suffix.lower()
            
            # Use random UUID for local disk storage to avoid path traversal / collision
            safe_name = f"in_{uuid.uuid4().hex}{ext}"
            file_path = job_dir / safe_name

            total_size = 0
            with open(file_path, "wb") as buffer:
                while chunk := await file.read(1024 * 1024):  # 1MB chunks
                    total_size += len(chunk)
                    if total_size > settings.MAX_UPLOAD_SIZE_BYTES:
                        # Clean up this file and raise
                        file_path.unlink(missing_ok=True)
                        raise HTTPException(
                            status_code=413,
                            detail=f"File '{orig_name}' exceeds maximum permitted upload limit ({settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)} MB)."
                        )
                    buffer.write(chunk)

            saved_files.append((orig_name, file_path, total_size))

        return saved_files

    def get_output_path(self, job_id: str, suffix: str = ".pdf") -> Path:
        job_dir = self.get_job_dir(job_id)
        output_name = f"out_{uuid.uuid4().hex}{suffix}"
        return job_dir / output_name

    def remove_job_dir(self, job_id: str):
        job_dir = self.base_dir / job_id
        if job_dir.exists() and job_dir.is_dir():
            shutil.rmtree(job_dir, ignore_errors=True)

storage_service = StorageService()
