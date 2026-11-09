import pytest
import io
import fitz
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db
from app.core.rate_limit import limiter
from app.security.ssrf_guard import validate_safe_url
from fastapi import HTTPException

@pytest.fixture(autouse=True)
async def setup_test_db():
    limiter.requests.clear()
    await init_db()
    yield
    limiter.requests.clear()

@pytest.fixture
def sample_pdf_bytes():
    """Generates an in-memory test PDF."""
    doc = fitz.open()
    page = doc.new_page(width=300, height=300)
    page.insert_text(fitz.Point(50, 100), "CrazyPDF Test Document 1", fontsize=14)
    page2 = doc.new_page(width=300, height=300)
    page2.insert_text(fitz.Point(50, 100), "CrazyPDF Page 2 Content", fontsize=14)
    data = doc.tobytes()
    doc.close()
    return data

@pytest.mark.asyncio
async def test_health():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert "CrazyPDF" in data["service"]

@pytest.mark.asyncio
async def test_auth_google_demo():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/v1/auth/google", json={"credential": "demo_google_token"})
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["email"] == "alex.demo@example.com"

@pytest.mark.asyncio
async def test_compress_pdf(sample_pdf_bytes):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {
            "files": ("test.pdf", sample_pdf_bytes, "application/pdf")
        }
        res = await client.post(
            "/api/v1/tools/process/compress-pdf",
            files=files,
            data={"options": '{"mode":"recommended"}'}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "completed"
        assert "download_url" in data
        assert data["tool_name"] == "compress-pdf"

        # Verify downloading the file
        download_res = await client.get(data["download_url"])
        assert download_res.status_code == 200
        assert len(download_res.content) > 0

@pytest.mark.asyncio
async def test_merge_pdf(sample_pdf_bytes):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = [
            ("files", ("doc1.pdf", sample_pdf_bytes, "application/pdf")),
            ("files", ("doc2.pdf", sample_pdf_bytes, "application/pdf")),
        ]
        res = await client.post(
            "/api/v1/tools/process/merge-pdf",
            files=files,
            data={"options": "{}"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "completed"
        assert data["output_filename"] == "crazypdf_merged.pdf"

@pytest.mark.asyncio
async def test_split_pdf(sample_pdf_bytes):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {
            "files": ("doc.pdf", sample_pdf_bytes, "application/pdf")
        }
        res = await client.post(
            "/api/v1/tools/process/split-pdf",
            files=files,
            data={"options": '{"mode":"range","ranges":"1"}'}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "completed"

@pytest.mark.asyncio
async def test_protect_and_unlock_pdf(sample_pdf_bytes):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Protect
        res_protect = await client.post(
            "/api/v1/tools/process/protect-pdf",
            files={"files": ("plain.pdf", sample_pdf_bytes, "application/pdf")},
            data={"options": '{"password":"superSecret123"}'}
        )
        assert res_protect.status_code == 200
        protect_data = res_protect.json()
        
        # Download protected PDF bytes
        dl_res = await client.get(protect_data["download_url"])
        assert dl_res.status_code == 200
        encrypted_bytes = dl_res.content

        # 2. Unlock with correct password
        res_unlock = await client.post(
            "/api/v1/tools/process/unlock-pdf",
            files={"files": ("encrypted.pdf", encrypted_bytes, "application/pdf")},
            data={"options": '{"password":"superSecret123"}'}
        )
        assert res_unlock.status_code == 200
        assert res_unlock.json()["status"] == "completed"

@pytest.mark.asyncio
async def test_ai_summarizer(sample_pdf_bytes):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {
            "files": ("doc.pdf", sample_pdf_bytes, "application/pdf")
        }
        res = await client.post(
            "/api/v1/tools/process/ai-summarizer",
            files=files,
            data={"options": "{}"}
        )
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "completed"
        assert "extra_data" in data
        assert "short_summary" in data["extra_data"]

def test_ssrf_guard():
    with pytest.raises(HTTPException):
        validate_safe_url("http://127.0.0.1/admin")
    with pytest.raises(HTTPException):
        validate_safe_url("http://localhost:8080")
    with pytest.raises(HTTPException):
        validate_safe_url("http://169.254.169.254/latest/meta-data")
    with pytest.raises(HTTPException):
        validate_safe_url("file:///etc/passwd")
    with pytest.raises(HTTPException):
        validate_safe_url("ftp://example.com/test")
