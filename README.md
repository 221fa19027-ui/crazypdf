# CrazyPDF 📄⚡
> **All Your PDF Tools. One Crazy-Simple Workspace.**

CrazyPDF is a premium, privacy-first online PDF productivity platform inspired by the speed and simplicity of tools like iLovePDF, Smallpdf, and Adobe Acrobat, built with a modern SaaS interface and an uncompromising **Zero Permanent Storage Policy**.

---

## 🌟 Core Principles

- **Zero Permanent Document Storage:** Documents are processed in isolated temporary sandboxes and automatically deleted after 60 minutes or immediately upon download. No document binaries, OCR text, or passwords are ever permanently stored.
- **Google OAuth 2.0 Only:** No traditional passwords, registration forms, or password resets. Cryptographically verified Google OpenID Connect on the backend.
- **Enterprise Security:** Inherent SSRF guards for HTML conversions (blocking loopback, private RFC1918 subnets, and cloud metadata endpoints), AES-256 PDF encryption, irreversible vector redaction, rate limiting, and strict CSP headers.
- **All 34 Tools Fully Functional:** Every tool has its own dedicated frontend route, API endpoint, and specialized backend processing engine.

---

## 🛠️ Complete PDF Toolkit (34 Tools)

### A. Organize PDF
1. **Merge PDF** (`/tools/merge-pdf`) — Combine multiple PDF files in custom drag-and-drop order.
2. **Split PDF** (`/tools/split-pdf`) — Extract page ranges or split every page into a ZIP archive.
3. **Organize PDF** (`/tools/organize-pdf`) — Reorder, delete, duplicate, and rearrange pages.
4. **Rotate PDF** (`/tools/rotate-pdf`) — Rotate pages 90°, 180°, or 270° (all, odd, even, or specific).
5. **Add Page Numbers** (`/tools/add-page-numbers`) — Add customizable header/footer numbering with positioning.
6. **Crop PDF** (`/tools/crop-pdf`) — Trim page margins or focus custom dimensions.

### B. Optimize PDF
7. **Compress PDF** (`/tools/compress-pdf`) — Three compression modes: Extreme, Recommended, and Low with genuine size calculations.
8. **Repair PDF** (`/tools/repair-pdf`) — Salvage corrupted PDF xref tables and damaged object streams.
9. **PDF to PDF/A** (`/tools/pdf-to-pdfa`) — Convert to ISO-standard PDF/A-1b archival format.

### C. Convert From PDF
10. **PDF to Word** (`/tools/pdf-to-word`) — Convert to editable Microsoft Word (.docx) preserving headings and paragraphs.
11. **PDF to PowerPoint** (`/tools/pdf-to-powerpoint`) — Convert PDF pages into editable PowerPoint (.pptx) presentation slides.
12. **PDF to Excel** (`/tools/pdf-to-excel`) — Extract tables, rows, and structured financial data into .xlsx sheets.
13. **PDF to JPG** (`/tools/pdf-to-jpg`) — Extract high-resolution JPG images with configurable DPI.
14. **PDF to PNG** (`/tools/pdf-to-png`) — Convert pages into lossless transparent PNG images.
15. **PDF to Markdown** (`/tools/pdf-to-markdown`) — Extract clean structured Markdown with headings, tables, and lists.
16. **OCR PDF** (`/tools/ocr-pdf`) — Convert scanned paper documents into searchable text PDFs.

### D. Convert To PDF
17. **Word to PDF** (`/tools/word-to-pdf`) — Convert Microsoft Word (.docx/.doc) into styled PDF documents.
18. **PowerPoint to PDF** (`/tools/powerpoint-to-pdf`) — Turn slide decks (.pptx/.ppt) into PDF presentations.
19. **Excel to PDF** (`/tools/excel-to-pdf`) — Render spreadsheets (.xlsx/.xls) into formatted PDF tables.
20. **JPG to PDF** (`/tools/jpg-to-pdf`) — Combine multiple JPG photos into a single PDF with orientation options.
21. **PNG to PDF** (`/tools/png-to-pdf`) — Transform PNG graphics into crisp PDF pages.
22. **HTML to PDF** (`/tools/html-to-pdf`) — Convert HTML files or secure web URLs into PDFs with strict SSRF filtering.

### E. Edit PDF
23. **Edit PDF** (`/tools/edit-pdf`) — Interactive web editor: add text, shapes, highlight boxes, and notes.
24. **Watermark PDF** (`/tools/watermark-pdf`) — Stamp diagonal/centered text or logo watermarks with angle and opacity control.
25. **Sign PDF** (`/tools/sign-pdf`) — Draw signatures on interactive canvas, type cursive names, or upload signature images.
26. **PDF Forms** (`/tools/pdf-forms`) — Detect, fill, check, and flatten interactive PDF form fields.

### F. PDF Security
27. **Protect PDF** (`/tools/protect-pdf`) — Encrypt documents with military-grade AES-256 passwords and permission restrictions.
28. **Unlock PDF** (`/tools/unlock-pdf`) — Decrypt protected files with authorized password verification.
29. **Redact PDF** (`/tools/redact-pdf`) — True irreversible redaction: sanitizes underlying vector text objects and pixel streams.
30. **Compare PDF** (`/tools/compare-pdf`) — Side-by-side textual and visual difference inspection between two documents.

### G. AI PDF Tools
31. **AI Summarizer** (`/tools/ai-summarizer`) — Executive synthesis, key bullet points, and action items report.
32. **Translate PDF** (`/tools/translate-pdf`) — Multilingual document translation across 30+ international languages.
33. **Chat with PDF** (`/tools/chat-with-pdf`) — Conversational assistant with page-referenced quotes and citations.
34. **AI PDF to Markdown** (`/tools/ai-pdf-to-markdown`) — LLM-optimized structural extraction of complex layouts to Markdown.

---

## 🏗️ Technology Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Framer Motion, Canvas Confetti.
- **Backend:** Python 3.11, FastAPI, Pydantic, PyMuPDF (fitz), reportlab, python-docx, python-pptx, openpyxl, pypdf, Pillow.
- **Database & Auth:** SQLAlchemy Async, SQLite (local zero-config) / PostgreSQL (production), Google OAuth 2.0 OpenID Connect.
- **Infrastructure:** Docker, Docker Compose, Nginx reverse proxy.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create & activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run backend test suite
pytest -v

# Start FastAPI development server
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# In another terminal, navigate to frontend
cd frontend

# Install packages
npm install

# Build production bundle
npm run build

# Start Vite development server
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## 🐳 Docker Compose Deployment

Run the complete multi-container production stack (PostgreSQL, Redis, FastAPI Backend, Nginx Frontend) with a single command:

```bash
docker-compose up --build
```

Access points:
- **Web Application:** `http://localhost`
- **Backend API:** `http://localhost:8000`
- **Interactive OpenAPI Docs:** `http://localhost:8000/docs`

---

## 🔒 Security & Privacy Guarantees

1. **Automated Ephemeral Deletion:** Background tasks scan and purge all files older than 60 minutes.
2. **SSRF Guard:** The HTML-to-PDF converter validates every target host against private IP ranges (`127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, link-local `169.254.0.0/16`) and resolves DNS before fetching.
3. **Sliding-Window Rate Limiting:** Enforces maximum uploads per minute and conversion quotas per IP.
4. **Safe User Metadata Only:** User passwords are never requested or stored. Only public Google profile metadata is retained in the database.

---

## 📄 License
CrazyPDF is released under the MIT License.
