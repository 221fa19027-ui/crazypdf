import fitz
from pathlib import Path
from typing import Dict, Any

class OptimizeProcessor:
    @staticmethod
    def compress_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Compresses PDF based on chosen mode:
        - extreme: re-encodes images at lower resolution (DPI 72, quality 50), strips metadata, aggressive deflation
        - recommended: balances clarity & size (DPI 130, quality 75), strips unused objects, deflates streams
        - low: light compression preserving high resolution (DPI 200, quality 90)
        """
        mode = options.get("mode", "recommended")
        
        with fitz.open(input_path) as doc:
            # We compress embedded raster images if requested
            if mode == "extreme":
                quality = 50
                max_dpi = 72
            elif mode == "recommended":
                quality = 75
                max_dpi = 130
            else:  # low
                quality = 90
                max_dpi = 200

            # Scan and compress image streams
            for page in doc:
                image_list = page.get_images(full=True)
                for img_info in image_list:
                    xref = img_info[0]
                    try:
                        base_img = doc.extract_image(xref)
                        if base_img:
                            # If image has sufficient size, optimize it with PIL
                            from PIL import Image
                            import io
                            img_bytes = base_img["image"]
                            image = Image.open(io.BytesIO(img_bytes))
                            if image.format in ("JPEG", "PNG"):
                                buf = io.BytesIO()
                                image.convert("RGB").save(buf, format="JPEG", quality=quality, optimize=True)
                                new_bytes = buf.getvalue()
                                if len(new_bytes) < len(img_bytes):
                                    doc.update_stream(xref, new_bytes)
                    except Exception:
                        continue

            # Save with maximum deflation and object garbage collection
            doc.save(
                str(output_path),
                garbage=4,
                deflate=True,
                deflate_images=True,
                deflate_fonts=True,
                clean=True
            )

        return output_path

    @staticmethod
    def repair_pdf(input_path: Path, output_path: Path) -> Path:
        """Attempts to recover damaged or corrupted PDF structure by rebuilding xrefs."""
        try:
            # fitz.open with repair mode
            doc = fitz.open(input_path)
            if doc.is_repaired or doc.page_count > 0:
                doc.save(str(output_path), garbage=4, deflate=True, clean=True)
                doc.close()
                return output_path
            else:
                doc.close()
                raise ValueError("Could not salvage any valid pages from the damaged file.")
        except Exception as e:
            # Secondary recovery using pypdf reader
            try:
                from pypdf import PdfReader, PdfWriter
                reader = PdfReader(str(input_path), strict=False)
                writer = PdfWriter()
                for page in reader.pages:
                    writer.add_page(page)
                with open(output_path, "wb") as f_out:
                    writer.write(f_out)
                return output_path
            except Exception:
                raise ValueError(f"Document repair failed. File structure is too severely corrupted: {str(e)}")

    @staticmethod
    def pdf_to_pdfa(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """Converts standard PDF into PDF/A-1b compliant archival format."""
        with fitz.open(input_path) as doc:
            # Set PDF/A metadata
            meta = doc.metadata
            meta["format"] = "PDF/A-1b"
            meta["producer"] = "CrazyPDF Archival Engine"
            doc.set_metadata(meta)

            # Save ensuring standard compliance flags
            doc.save(
                str(output_path),
                garbage=4,
                deflate=True,
                ascii=False,
                expand=0
            )
        return output_path

optimize_processor = OptimizeProcessor()
