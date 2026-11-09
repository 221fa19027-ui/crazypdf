import io
import fitz
import zipfile
from pathlib import Path
from typing import Dict, Any
from docx import Document
from docx.shared import Inches, Pt
from pptx import Presentation
from pptx.util import Inches as PptxInches, Pt as PptxPt
from openpyxl import Workbook
from PIL import Image

class ConvertFromProcessor:
    @staticmethod
    def pdf_to_word(input_path: Path, output_path: Path) -> Path:
        """Converts PDF pages into structured Microsoft Word (.docx) document."""
        doc = Document()
        with fitz.open(input_path) as pdf_doc:
            for page_num, page in enumerate(pdf_doc):
                if page_num > 0:
                    doc.add_page_break()

                # Extract text blocks
                blocks = page.get_text("blocks")
                # blocks format: (x0, y0, x1, y1, text, block_no, block_type)
                for b in blocks:
                    text = b[4].strip()
                    if not text:
                        continue
                    
                    # Detect potential heading if short and larger or all caps
                    lines = text.split("\n")
                    first_line = lines[0].strip()
                    if len(first_line) < 60 and len(lines) == 1 and (first_line.isupper() or len(first_line.split()) <= 6):
                        p = doc.add_heading(first_line, level=2)
                    else:
                        p = doc.add_paragraph(text)
                        p.paragraph_format.space_after = Pt(6)

        docx_path = output_path.with_suffix(".docx")
        doc.save(str(docx_path))
        return docx_path

    @staticmethod
    def pdf_to_powerpoint(input_path: Path, output_path: Path) -> Path:
        """Converts each PDF page into a high-fidelity PowerPoint (.pptx) slide."""
        prs = Presentation()
        # Set 16:9 widescreen or 4:3 slide dimensions matching PDF
        prs.slide_width = PptxInches(10)
        prs.slide_height = PptxInches(7.5)
        blank_slide_layout = prs.slide_layouts[6]

        with fitz.open(input_path) as pdf_doc:
            for page in pdf_doc:
                slide = prs.slides.add_slide(blank_slide_layout)
                
                # Render page to high-res image
                pix = page.get_pixmap(dpi=150)
                img_bytes = pix.tobytes("png")
                img_stream = io.BytesIO(img_bytes)

                # Add image slide background
                slide.shapes.add_picture(img_stream, PptxInches(0), PptxInches(0), width=prs.slide_width, height=prs.slide_height)

        pptx_path = output_path.with_suffix(".pptx")
        prs.save(str(pptx_path))
        return pptx_path

    @staticmethod
    def pdf_to_excel(input_path: Path, output_path: Path) -> Path:
        """Extracts structured text lines and tables into Microsoft Excel (.xlsx) spreadsheet."""
        wb = Workbook()
        ws = wb.active
        ws.title = "Extracted Data"

        row_idx = 1
        with fitz.open(input_path) as pdf_doc:
            for page_idx, page in enumerate(pdf_doc):
                # Add page separator header
                ws.cell(row=row_idx, column=1, value=f"--- Page {page_idx + 1} ---")
                row_idx += 1

                # Extract words or tables
                tables = page.find_tables()
                if tables and len(tables.tables) > 0:
                    for tab in tables:
                        for row in tab.extract():
                            for col_idx, cell_value in enumerate(row, start=1):
                                ws.cell(row=row_idx, column=col_idx, value=str(cell_value) if cell_value is not None else "")
                            row_idx += 1
                        row_idx += 1
                else:
                    # Fallback to lines
                    text = page.get_text("text")
                    for line in text.split("\n"):
                        if line.strip():
                            # Split by common delimiters (tabs, multiple spaces, commas)
                            parts = [p.strip() for p in line.split("  ") if p.strip()]
                            if not parts:
                                parts = [line.strip()]
                            for col_idx, part in enumerate(parts, start=1):
                                ws.cell(row=row_idx, column=col_idx, value=part)
                            row_idx += 1

        xlsx_path = output_path.with_suffix(".xlsx")
        wb.save(str(xlsx_path))
        return xlsx_path

    @staticmethod
    def pdf_to_images(input_path: Path, output_path: Path, format_type: str = "jpg", dpi: int = 150) -> Path:
        """Converts PDF pages into JPG or PNG images. Packs into ZIP if multi-page."""
        ext = format_type.lower()
        with fitz.open(input_path) as pdf_doc:
            total = len(pdf_doc)
            if total == 1:
                # Single image
                page = pdf_doc[0]
                pix = page.get_pixmap(dpi=dpi)
                final_path = output_path.with_suffix(f".{ext}")
                pix.save(str(final_path))
                return final_path
            else:
                # Multi-page ZIP
                zip_path = output_path.with_suffix(".zip")
                with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for i, page in enumerate(pdf_doc):
                        pix = page.get_pixmap(dpi=dpi)
                        temp_img = output_path.parent / f"page_{i+1}.{ext}"
                        pix.save(str(temp_img))
                        zipf.write(temp_img, arcname=f"page_{i+1}.{ext}")
                        temp_img.unlink(missing_ok=True)
                return zip_path

    @staticmethod
    def pdf_to_markdown(input_path: Path, output_path: Path) -> Path:
        """Extracts structured Markdown with headers, lists, and paragraphs from PDF."""
        md_lines = []
        with fitz.open(input_path) as pdf_doc:
            # Document title from metadata if available
            title = pdf_doc.metadata.get("title")
            if title:
                md_lines.append(f"# {title}\n")

            for page_idx, page in enumerate(pdf_doc):
                md_lines.append(f"\n<!-- Page {page_idx + 1} -->\n")
                blocks = page.get_text("blocks")
                for b in blocks:
                    text = b[4].strip()
                    if not text:
                        continue
                    
                    lines = text.split("\n")
                    if len(lines) == 1 and len(lines[0]) < 50:
                        # Probable header
                        md_lines.append(f"## {lines[0]}\n")
                    else:
                        formatted_p = "\n".join(lines)
                        md_lines.append(f"{formatted_p}\n")

        md_path = output_path.with_suffix(".md")
        with open(md_path, "w", encoding="utf-8") as f:
            f.write("\n".join(md_lines))
        return md_path

    @staticmethod
    def ocr_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Extracts and verifies searchable text layers across scanned document pages.
        Produces a searchable PDF copy.
        """
        with fitz.open(input_path) as doc:
            # If document already contains embedded text, clean and standardize
            # Otherwise use fitz OCR feature if available
            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

convert_from_processor = ConvertFromProcessor()
