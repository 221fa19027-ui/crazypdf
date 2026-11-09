import math
import fitz
import base64
import io
from pathlib import Path
from typing import List, Dict, Any

class EditProcessor:
    @staticmethod
    def edit_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Applies interactive edits to the PDF:
        - text additions (page, x, y, text, size, color)
        - highlight boxes (page, rect)
        - shapes/lines
        """
        annotations = options.get("annotations", [])
        with fitz.open(input_path) as doc:
            for annot in annotations:
                p_idx = int(annot.get("page", 1)) - 1
                if 0 <= p_idx < len(doc):
                    page = doc[p_idx]
                    a_type = annot.get("type", "text")

                    if a_type == "text":
                        x = float(annot.get("x", 50))
                        y = float(annot.get("y", 50))
                        text = annot.get("text", "")
                        size = float(annot.get("size", 12))
                        color = annot.get("color", [0, 0, 0])
                        # convert 0-255 to 0.0-1.0 if needed
                        rgb = tuple(c / 255.0 if c > 1 else c for c in color[:3])
                        page.insert_text(fitz.Point(x, y), text, fontsize=size, color=rgb, fontname="helv")

                    elif a_type == "highlight":
                        x0 = float(annot.get("x0", 50))
                        y0 = float(annot.get("y0", 50))
                        x1 = float(annot.get("x1", 200))
                        y1 = float(annot.get("y1", 70))
                        rect = fitz.Rect(x0, y0, x1, y1)
                        highlight = page.add_highlight_annot(rect)
                        highlight.update()

                    elif a_type == "rect":
                        x0 = float(annot.get("x0", 50))
                        y0 = float(annot.get("y0", 50))
                        x1 = float(annot.get("x1", 200))
                        y1 = float(annot.get("y1", 100))
                        rect = fitz.Rect(x0, y0, x1, y1)
                        page.draw_rect(rect, color=(0.3, 0.4, 0.9), width=1.5)

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

    @staticmethod
    def watermark_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Applies a diagonal or centered watermark (text or image) to all pages.
        Options:
        - text: watermark string (e.g., 'CONFIDENTIAL', 'SAMPLE', 'DRAFT')
        - opacity: 0.1 to 1.0 (default 0.25)
        - rotation: angle in degrees (default 45)
        - color: [r, g, b]
        - font_size: float
        """
        text = options.get("text", "CONFIDENTIAL")
        opacity = float(options.get("opacity", 0.25))
        rotation = float(options.get("rotation", 45))
        font_size = float(options.get("font_size", 48.0))
        color_raw = options.get("color", [200, 30, 30])
        rgb = tuple(c / 255.0 if c > 1 else c for c in color_raw[:3])

        with fitz.open(input_path) as doc:
            for page in doc:
                r = page.rect
                # Center point
                p = fitz.Point(r.width / 2, r.height / 2)
                
                # Use insert_text with morph matrix for rotation
                matrix = fitz.Matrix(rotation)
                # Or create subtle watermark stamp
                page.insert_text(
                    p,
                    text,
                    fontsize=font_size,
                    fontname="helv",
                    color=rgb,
                    rotate=int(rotation) % 360,
                    align=fitz.TEXT_ALIGN_CENTER
                )

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

    @staticmethod
    def sign_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Applies electronic signature image/draw/type to specified page.
        Options:
        - signature_data: base64 data URL ('data:image/png;base64,...') or typed text
        - page: int (1-based)
        - x, y: coordinates
        - width, height: dimensions
        """
        sig_data = options.get("signature_data", "")
        page_num = int(options.get("page", 1)) - 1
        x = float(options.get("x", 100))
        y = float(options.get("y", 650))
        w = float(options.get("width", 160))
        h = float(options.get("height", 60))

        with fitz.open(input_path) as doc:
            if 0 <= page_num < len(doc):
                page = doc[page_num]

                if sig_data.startswith("data:image"):
                    # Extract raw base64 bytes
                    header, encoded = sig_data.split(",", 1)
                    img_bytes = base64.b64decode(encoded)
                    rect = fitz.Rect(x, y, x + w, y + h)
                    page.insert_image(rect, stream=img_bytes)
                else:
                    # Typed cursive-style signature
                    rect = fitz.Rect(x, y, x + w, y + h)
                    page.draw_rect(rect, color=(0.8, 0.8, 0.8), width=0.5)
                    page.insert_text(fitz.Point(x + 10, y + h - 15), sig_data, fontsize=18, color=(0.05, 0.1, 0.4), fontname="times-italic")

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

    @staticmethod
    def pdf_forms(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Detects, fills, and flattens interactive PDF form fields.
        options['fields'] is a dict of {fieldName: value}.
        """
        fields = options.get("fields", {})
        with fitz.open(input_path) as doc:
            for page in doc:
                for widget in page.widgets():
                    if widget.field_name in fields:
                        widget.field_value = str(fields[widget.field_name])
                        widget.update()

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

edit_processor = EditProcessor()
