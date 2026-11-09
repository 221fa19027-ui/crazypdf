import os
import shutil
import time
from datetime import datetime
from pathlib import Path
from sqlalchemy import select, delete
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.job import ProcessingJob

class CleanupService:
    @staticmethod
    async def cleanup_expired_jobs():
        """Scans database and file system to permanently remove expired job artifacts."""
        now = datetime.utcnow()
        async with AsyncSessionLocal() as session:
            # Query expired jobs
            stmt = select(ProcessingJob).where(ProcessingJob.expires_at <= now)
            result = await session.execute(stmt)
            expired_jobs = result.scalars().all()

            for job in expired_jobs:
                job_dir = Path(settings.TEMP_STORAGE_DIR) / job.id
                if job_dir.exists() and job_dir.is_dir():
                    shutil.rmtree(job_dir, ignore_errors=True)

            # Cleanup expired records or mark as expired
            # We can retain metadata row if desired for privacy-safe history, but wipe filenames/tokens
            for job in expired_jobs:
                job.download_token = None
                job.output_filename = None
            
            await session.commit()

        # Also purge any orphaned directories in temp storage older than 2 * expiration
        base_dir = Path(settings.TEMP_STORAGE_DIR)
        if base_dir.exists():
            cutoff = time.time() - (settings.FILE_EXPIRATION_MINUTES * 60)
            for item in base_dir.iterdir():
                if item.is_dir():
                    try:
                        mtime = item.stat().st_mtime
                        if mtime < cutoff:
                            shutil.rmtree(item, ignore_errors=True)
                    except Exception:
                        pass

    @staticmethod
    def startup_cleanup():
        """Executed during server startup to remove any lingering files from previous runs."""
        base_dir = Path(settings.TEMP_STORAGE_DIR)
        if base_dir.exists():
            for item in base_dir.iterdir():
                try:
                    if item.is_dir():
                        shutil.rmtree(item, ignore_errors=True)
                    elif item.is_file():
                        item.unlink(missing_ok=True)
                except Exception:
                    pass
        base_dir.mkdir(parents=True, exist_ok=True)

cleanup_service = CleanupService()
