import json
import time
import uuid
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import get_current_user_optional, generate_secure_token
from app.core.rate_limit import rate_limit_upload, rate_limit_conversion
from app.models.user import User
from app.models.job import ProcessingJob
from app.models.usage import UsageRecord
from app.services.storage_service import storage_service

# Processors
from app.processors.organize import organize_processor
from app.processors.optimize import optimize_processor
from app.processors.convert_from import convert_from_processor
from app.processors.convert_to import convert_to_processor
from app.processors.edit import edit_processor
from app.processors.security_pdf import security_processor
from app.processors.ai_tools import ai_tools_processor

router = APIRouter()

@router.post("/process/{tool_name}", dependencies=[Depends(rate_limit_upload), Depends(rate_limit_conversion)])
async def process_document(
    tool_name: str,
    files: Optional[List[UploadFile]] = File(None),
    options: str = Form("{}"),
    user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    """
    Universal processing endpoint for all CrazyPDF tools.
    Handles upload, isolated processing, output generation, and zero permanent storage lifecycle.
    """
    job_id = str(uuid.uuid4())
    start_time = time.time()
    
    # Parse options JSON
    try:
        opts = json.loads(options) if options else {}
    except Exception:
        opts = {}

    # HTML to PDF might not require a file if URL is provided
    if (not files or len(files) == 0) and tool_name == "html-to-pdf" and opts.get("url"):
        saved_files = []
    elif not files or len(files) == 0:
        raise HTTPException(status_code=400, detail="No files uploaded.")
    else:
        # Save files to isolated job directory with UUIDs
        saved_files = await storage_service.save_uploaded_files(job_id, files)

    input_size = sum(f[2] for f in saved_files)
    first_path = saved_files[0][1] if saved_files else None
    first_name = saved_files[0][0] if saved_files else "document"
    input_paths = [f[1] for f in saved_files]

    output_path = storage_service.get_output_path(job_id, suffix=".pdf")
    download_filename = f"crazypdf_{Path(first_name).stem}.pdf"
    mime_type = "application/pdf"
    extra_payload = None

    try:
        # ================= A. ORGANIZE PDF =================
        if tool_name == "merge-pdf":
            if len(input_paths) < 2:
                raise HTTPException(status_code=400, detail="Please upload at least 2 PDF files to merge.")
            output_file = organize_processor.merge_pdf(input_paths, output_path)
            download_filename = "crazypdf_merged.pdf"

        elif tool_name == "split-pdf":
            output_file = organize_processor.split_pdf(first_path, output_path, opts)
            if output_file.suffix == ".zip":
                download_filename = f"crazypdf_{Path(first_name).stem}_split.zip"
                mime_type = "application/zip"
            else:
                download_filename = f"crazypdf_{Path(first_name).stem}_split.pdf"

        elif tool_name == "organize-pdf":
            output_file = organize_processor.organize_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_organized.pdf"

        elif tool_name == "rotate-pdf":
            output_file = organize_processor.rotate_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_rotated.pdf"

        elif tool_name == "add-page-numbers":
            output_file = organize_processor.add_page_numbers(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_numbered.pdf"

        elif tool_name == "crop-pdf":
            output_file = organize_processor.crop_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_cropped.pdf"

        # ================= B. OPTIMIZE PDF =================
        elif tool_name == "compress-pdf":
            output_file = optimize_processor.compress_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_compressed.pdf"

        elif tool_name == "repair-pdf":
            output_file = optimize_processor.repair_pdf(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}_repaired.pdf"

        elif tool_name == "pdf-to-pdfa":
            output_file = optimize_processor.pdf_to_pdfa(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_pdfa.pdf"

        # ================= C. CONVERT FROM PDF =================
        elif tool_name == "pdf-to-word":
            output_file = convert_from_processor.pdf_to_word(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.docx"
            mime_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        elif tool_name == "pdf-to-powerpoint":
            output_file = convert_from_processor.pdf_to_powerpoint(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.pptx"
            mime_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

        elif tool_name == "pdf-to-excel":
            output_file = convert_from_processor.pdf_to_excel(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.xlsx"
            mime_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        elif tool_name == "pdf-to-jpg":
            output_file = convert_from_processor.pdf_to_images(first_path, output_path, "jpg", opts.get("dpi", 150))
            if output_file.suffix == ".zip":
                download_filename = f"crazypdf_{Path(first_name).stem}_images.zip"
                mime_type = "application/zip"
            else:
                download_filename = f"crazypdf_{Path(first_name).stem}.jpg"
                mime_type = "image/jpeg"

        elif tool_name == "pdf-to-png":
            output_file = convert_from_processor.pdf_to_images(first_path, output_path, "png", opts.get("dpi", 150))
            if output_file.suffix == ".zip":
                download_filename = f"crazypdf_{Path(first_name).stem}_images.zip"
                mime_type = "application/zip"
            else:
                download_filename = f"crazypdf_{Path(first_name).stem}.png"
                mime_type = "image/png"

        elif tool_name in ("pdf-to-markdown", "ai-pdf-to-markdown"):
            output_file = convert_from_processor.pdf_to_markdown(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.md"
            mime_type = "text/markdown"

        elif tool_name == "ocr-pdf":
            output_file = convert_from_processor.ocr_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_searchable.pdf"

        # ================= D. CONVERT TO PDF =================
        elif tool_name == "word-to-pdf":
            output_file = convert_to_processor.word_to_pdf(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.pdf"

        elif tool_name == "powerpoint-to-pdf":
            output_file = convert_to_processor.powerpoint_to_pdf(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.pdf"

        elif tool_name == "excel-to-pdf":
            output_file = convert_to_processor.excel_to_pdf(first_path, output_path)
            download_filename = f"crazypdf_{Path(first_name).stem}.pdf"

        elif tool_name in ("jpg-to-pdf", "png-to-pdf"):
            output_file = convert_to_processor.images_to_pdf(input_paths, output_path, opts)
            download_filename = "crazypdf_converted.pdf"

        elif tool_name == "html-to-pdf":
            output_file = convert_to_processor.html_to_pdf(first_path, output_path, opts)
            download_filename = "crazypdf_webpage.pdf"

        # ================= E. EDIT PDF =================
        elif tool_name == "edit-pdf":
            output_file = edit_processor.edit_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_edited.pdf"

        elif tool_name == "watermark-pdf":
            output_file = edit_processor.watermark_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_watermarked.pdf"

        elif tool_name == "sign-pdf":
            output_file = edit_processor.sign_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_signed.pdf"

        elif tool_name == "pdf-forms":
            output_file = edit_processor.pdf_forms(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_completed.pdf"

        # ================= F. PDF SECURITY =================
        elif tool_name == "protect-pdf":
            output_file = security_processor.protect_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_protected.pdf"

        elif tool_name == "unlock-pdf":
            output_file = security_processor.unlock_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_unlocked.pdf"

        elif tool_name == "redact-pdf":
            output_file = security_processor.redact_pdf(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_redacted.pdf"

        elif tool_name == "compare-pdf":
            if len(input_paths) < 2:
                raise HTTPException(status_code=400, detail="Please upload 2 PDF files to compare.")
            extra_payload = security_processor.compare_pdf(input_paths[0], input_paths[1], output_path)
            output_file = output_path
            download_filename = "crazypdf_comparison_report.pdf"

        # ================= G. AI PDF TOOLS =================
        elif tool_name == "ai-summarizer":
            extra_payload = ai_tools_processor.summarize_pdf(first_path, opts)
            # Also create summary PDF
            output_file = output_path
            import fitz
            s_doc = fitz.open()
            sp = s_doc.new_page(width=595, height=842)
            sp.draw_rect(fitz.Rect(0, 0, 595, 60), color=None, fill=(0.31, 0.27, 0.90))
            sp.insert_text(fitz.Point(30, 40), "CrazyPDF AI Executive Summary", fontsize=16, color=(1, 1, 1), fontname="helv")
            sp.insert_textbox(fitz.Rect(40, 90, 555, 300), f"Executive Overview:\n{extra_payload['short_summary']}", fontsize=11, fontname="helv")
            sp.insert_textbox(fitz.Rect(40, 310, 555, 500), f"Key Points:\n" + "\n".join([f"• {p}" for p in extra_payload['main_points']]), fontsize=10, fontname="helv")
            sp.insert_textbox(fitz.Rect(40, 510, 555, 750), f"Action Items:\n" + "\n".join([f"✓ {a}" for a in extra_payload['action_items']]), fontsize=10, fontname="helv")
            s_doc.save(str(output_path))
            s_doc.close()
            download_filename = f"crazypdf_{Path(first_name).stem}_summary.pdf"

        elif tool_name == "translate-pdf":
            output_file = ai_tools_processor.translate_document(first_path, output_path, opts)
            download_filename = f"crazypdf_{Path(first_name).stem}_translated.pdf"

        elif tool_name == "chat-with-pdf":
            question = opts.get("question", "What is this document about?")
            extra_payload = ai_tools_processor.chat_query(first_path, question)
            output_file = output_path
            # Return same or annotated document
            import fitz
            with fitz.open(first_path) as orig_doc:
                orig_doc.save(str(output_path))
            download_filename = f"crazypdf_{Path(first_name).stem}.pdf"

        else:
            raise HTTPException(status_code=400, detail=f"Unsupported tool: {tool_name}")

    except Exception as e:
        # Clean up on failure
        storage_service.remove_job_dir(job_id)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

    duration = round(time.time() - start_time, 2)
    output_size = output_file.stat().st_size if output_file.exists() else 0
    token = generate_secure_token(32)

    # Clean input files immediately if no longer required (Zero permanent storage principle)
    for p in input_paths:
        if p != output_file and p.exists():
            p.unlink(missing_ok=True)

    # Record job in database
    job = ProcessingJob(
        id=job_id,
        user_id=user.id if user else None,
        tool_name=tool_name,
        status="completed",
        input_file_size=input_size,
        output_file_size=output_size,
        processing_time=duration,
        download_token=token,
        output_filename=download_filename,
        output_mime=mime_type,
        expires_at=ProcessingJob.create_expiration(minutes=60)
    )
    db.add(job)

    # Record usage metrics for authenticated users
    if user:
        usage = UsageRecord(
            user_id=user.id,
            tool_name=tool_name,
            processing_count=1,
            file_size=input_size
        )
        db.add(usage)

    await db.commit()

    return {
        "job_id": job_id,
        "tool_name": tool_name,
        "status": "completed",
        "input_file_size": input_size,
        "output_file_size": output_size,
        "processing_time": duration,
        "download_url": f"/api/v1/jobs/download/{token}",
        "output_filename": download_filename,
        "expires_at": job.expires_at.isoformat(),
        "extra_data": extra_payload
    }
