from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.job import ProcessingJob
from app.models.usage import UsageRecord

router = APIRouter()

@router.get("/dashboard")
async def get_user_dashboard(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns user's dashboard statistics, privacy-conscious history (no permanent links),
    usage numbers, and recently used tools.
    """
    # 1. Total jobs processed
    count_stmt = select(func.count(ProcessingJob.id)).where(ProcessingJob.user_id == user.id)
    total_jobs_res = await db.execute(count_stmt)
    total_jobs = total_jobs_res.scalar() or 0

    # 2. Total data processed
    size_stmt = select(func.sum(ProcessingJob.input_file_size)).where(ProcessingJob.user_id == user.id)
    total_size_res = await db.execute(size_stmt)
    total_bytes = total_size_res.scalar() or 0

    # 3. Recent jobs (privacy conscious metadata only: tool, timestamp, size, duration, status)
    jobs_stmt = (
        select(ProcessingJob)
        .where(ProcessingJob.user_id == user.id)
        .order_by(desc(ProcessingJob.created_at))
        .limit(10)
    )
    jobs_res = await db.execute(jobs_stmt)
    recent_jobs = jobs_res.scalars().all()

    # 4. Most used tools
    usage_stmt = (
        select(UsageRecord.tool_name, func.count(UsageRecord.id).label("count"))
        .where(UsageRecord.user_id == user.id)
        .group_by(UsageRecord.tool_name)
        .order_by(desc("count"))
        .limit(5)
    )
    usage_res = await db.execute(usage_stmt)
    top_tools = [{"tool": r[0], "count": r[1]} for r in usage_res.all()]

    return {
        "profile": {
            "name": user.name,
            "email": user.email,
            "profile_picture": user.profile_picture,
            "joined_date": user.created_at.strftime("%B %Y"),
            "last_login": user.last_login.isoformat(),
        },
        "stats": {
            "total_documents_processed": total_jobs,
            "total_megabytes_processed": round(total_bytes / (1024 * 1024), 2),
            "privacy_mode": "Zero Permanent Storage (Active)",
            "cleanup_schedule": "Auto-deletes every 60 min",
            "active_plan": "CrazyPDF Pro Free Tier",
        },
        "top_tools": top_tools,
        "recent_history": [
            {
                "id": j.id,
                "tool_name": j.tool_name,
                "status": j.status,
                "input_file_size": j.input_file_size,
                "processing_time": j.processing_time,
                "created_at": j.created_at.isoformat(),
                "is_expired": True,  # Temporary files are never permanently redownloadable from history
            }
            for j in recent_jobs
        ]
    }
