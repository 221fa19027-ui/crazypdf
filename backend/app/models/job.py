import uuid
from datetime import datetime, timedelta
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from app.core.database import Base

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    tool_name = Column(String(64), nullable=False, index=True)
    status = Column(String(32), default="waiting", nullable=False)  # waiting, uploading, validating, processing, finalizing, completed, failed, cancelled
    input_file_size = Column(Integer, default=0, nullable=False)
    output_file_size = Column(Integer, default=0, nullable=False)
    processing_time = Column(Float, default=0.0, nullable=False)
    download_token = Column(String(64), unique=True, index=True, nullable=True)
    output_filename = Column(String(255), nullable=True)
    output_mime = Column(String(128), nullable=True)
    error_message = Column(String(1024), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)

    @classmethod
    def create_expiration(cls, minutes: int = 60) -> datetime:
        return datetime.utcnow() + timedelta(minutes=minutes)
