from pathlib import Path
from typing import List, Dict, Any, Optional
from PIL import Image
import fitz
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from docx import Document
from openpyxl import load_workbook
from pptx import Presentation
from app.security.ssrf_guard import validate_safe_url

class ConvertToProcessor:
    @staticmethod
    def word_to_pdf(input_path: Path, output_path: Path) -> Path:
        """Converts Word DOCX document into a formatted PDF document."""
        doc = Document(str(input_path))
        pdf_doc = SimpleDocTemplate(str(output_path), pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
        styles = getSampleStyleSheet()
        story = []

        for p in doc.paragraphs:
            text = p.text.strip()
            if not text:
                story.append(Spacer(1, 10))
                continue
            
            # Match style name or length
            if p.style.name.startswith("Heading 1"):
                story.append(Paragraph(text, styles['Heading1']))
            elif p.style.name.startswith("Heading 2"):
                story.append(Paragraph(text, styles['Heading2']))
            elif p.style.name.startswith("Heading 3"):
                story.append(Paragraph(text, styles['Heading3']))
            else:
                story.append(Paragraph(text, styles['Normal']))
            story.append(Spacer(1, 6))

        for table in doc.tables:
            table_data = []
            for row in table.rows:
                row_data = [cell.text.strip() for cell in row.cells]
                table_data.append(row_data)
            if table_data:
                t = Table(table_data)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#4f46e5")),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
                ]))
                story.append(t)
                story.append(Spacer(1, 12))

        pdf_doc.build(story)
        return output_path

    @staticmethod
    def powerpoint_to_pdf(input_path: Path, output_path: Path) -> Path:
        """Converts PowerPoint slides into a slide-by-slide PDF presentation."""
        prs = Presentation(str(input_path))
        doc = fitz.open()

        for slide_idx, slide in enumerate(prs.slides):
            # Create a 4:3 or 16:9 page in fitz
            page = doc.new_page(width=720, height=540)
            
            # Header banner
            page.draw_rect(fitz.Rect(0, 0, 720, 60), color=None, fill=(0.31, 0.27, 0.90))
            page.insert_text(fitz.Point(30, 38), f"Slide {slide_idx + 1}", fontsize=18, color=(1, 1, 1), fontname="helv")

            y = 100
            for shape in slide.shapes:
                if shape.has_text_frame:
                    for paragraph in shape.text_frame.paragraphs:
                        text = paragraph.text.strip()
                        if text:
                            page.insert_text(fitz.Point(40, y), text, fontsize=12, color=(0.1, 0.1, 0.1), fontname="helv")
                            y += 24

        doc.save(str(output_path), garbage=4, deflate=True)
        doc.close()
        return output_path

    @staticmethod
    def excel_to_pdf(input_path: Path, output_path: Path) -> Path:
        """Converts Excel workbook sheets into clean PDF tabular pages."""
        wb = load_workbook(str(input_path), data_only=True)
        pdf_doc = SimpleDocTemplate(str(output_path), pagesize=A4, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        styles = getSampleStyleSheet()
        story = []

        for sheetname in wb.sheetnames:
            ws = wb[sheetname]
            story.append(Paragraph(f"Sheet: {sheetname}", styles['Heading2']))
            story.append(Spacer(1, 10))

            table_data = []
            for row in ws.iter_rows(values_only=True):
                # Filter out completely empty trailing rows
                if any(cell is not None for cell in row):
                    clean_row = [str(cell) if cell is not None else "" for cell in row[:8]]  # Max 8 cols for A4 width
                    table_data.append(clean_row)

            if table_data:
                t = Table(table_data)
                t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0ea5e9")),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 8),
                    ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
                ]))
                story.append(t)
            story.append(Spacer(1, 20))

        pdf_doc.build(story)
        return output_path

    @staticmethod
    def images_to_pdf(image_paths: List[Path], output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Converts multiple JPG or PNG images into a unified PDF document.
        Supports page orientation (portrait/landscape) and margin options.
        """
        orientation = options.get("orientation", "portrait")
        doc = fitz.open()

        for img_p in image_paths:
            with Image.open(img_p) as img:
                w, h = img.size

            if orientation == "landscape" and h > w:
                page_width, page_height = 842, 595  # A4 Landscape
            elif orientation == "portrait" and w > h:
                page_width, page_height = 595, 842  # A4 Portrait
            else:
                page_width, page_height = (595, 842) if orientation == "portrait" else (842, 595)

            page = doc.new_page(width=page_width, height=page_height)
            rect = fitz.Rect(20, 20, page_width - 20, page_height - 20)
            page.insert_image(rect, filename=str(img_p), keep_proportion=True)

        doc.save(str(output_path), garbage=4, deflate=True)
        doc.close()
        return output_path

    @staticmethod
    def html_to_pdf(input_path: Optional[Path], output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Converts HTML file content or validated web URL to PDF with strict SSRF protection.
        """
        url = options.get("url")
        html_content = ""

        if url:
            # Strictly validate against SSRF
            safe_url = validate_safe_url(url)
            import httpx
            # Fetch with timeout and strict headers
            with httpx.Client(timeout=10.0, follow_redirects=False) as client:
                res = client.get(safe_url)
                if res.status_code >= 400:
                    raise ValueError(f"Target URL returned error HTTP {res.status_code}")
                html_content = res.text
        elif input_path and input_path.exists():
            with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
                html_content = f.read()
        else:
            html_content = options.get("html", "<h1>CrazyPDF Generated Document</h1>")

        # Render styled PDF with PyMuPDF story
        doc = fitz.open()
        story = fitz.Story(html=html_content)
        writer = fitz.DocumentWriter(str(output_path))
        
        while True:
            device = writer.begin_page(fitz.Rect(0, 0, 595, 842))
            more = story.place(fitz.Rect(40, 40, 555, 802))
            story.draw(device)
            writer.end_page()
            if not more:
                break
        writer.close()
        return output_path

convert_to_processor = ConvertToProcessor()
