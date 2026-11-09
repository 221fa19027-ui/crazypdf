from pydantic import BaseModel
from typing import Optional, Any, Dict, List
from datetime import datetime

class JobResponse(BaseModel):
    job_id: str
    tool_name: str
    status: str
    input_file_size: int
    output_file_size: int
    processing_time: float
    download_url: Optional[str] = None
    output_filename: Optional[str] = None
    error_message: Optional[str] = None
    expires_at: Optional[datetime] = None
    extra_data: Optional[Dict[str, Any]] = None

class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int
    download_url: Optional[str] = None
    output_filename: Optional[str] = None
    error_message: Optional[str] = None
    original_size: int
    compressed_size: int
    savings_percent: float

class ChatRequest(BaseModel):
    job_id: str
    question: str
