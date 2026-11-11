import fitz  # PyMuPDF
import zipfile
from pathlib import Path
from typing import List, Dict, Any, Optional

class OrganizeProcessor:
    @staticmethod
    def merge_pdf(input_paths: List[Path], output_path: Path) -> Path:
        """Merges multiple PDF files into one in the specified order."""
        merged_doc = fitz.open()
        for p in input_paths:
            with fitz.open(p) as doc:
                merged_doc.insert_pdf(doc)
        merged_doc.save(str(output_path), garbage=4, deflate=True)
        merged_doc.close()
        return output_path

    @staticmethod
    def split_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Split PDF by pages, ranges, or every page.
        Modes:
          - 'all':        One PDF per page, zipped together.
          - 'range':      Extract selected pages (single page range) into one PDF.
          - 'multi':      Split at comma-separated ranges, each range -> separate PDF, all zipped.
        """
        mode = options.get("mode", "range")  # 'range', 'all', 'multi'
        page_range_str = options.get("ranges", "1-end")

        with fitz.open(input_path) as doc:
            total_pages = len(doc)
            if total_pages == 0:
                raise ValueError("PDF document has no pages.")

            if mode == "all":
                # One PDF per page, zipped
                zip_path = output_path.with_suffix(".zip")
                with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for i in range(total_pages):
                        single_doc = fitz.open()
                        single_doc.insert_pdf(doc, from_page=i, to_page=i)
                        temp_page_file = output_path.parent / f"page_{i+1}.pdf"
                        single_doc.save(str(temp_page_file))
                        single_doc.close()
                        zipf.write(temp_page_file, arcname=f"page_{i+1}.pdf")
                        temp_page_file.unlink(missing_ok=True)
                return zip_path

            elif mode == "multi":
                # Each comma-separated range becomes its own PDF, all packed into a ZIP
                zip_path = output_path.with_suffix(".zip")
                range_parts = [r.strip() for r in page_range_str.split(",") if r.strip()]
                if not range_parts:
                    range_parts = [f"1-{total_pages}"]

                with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
                    for seg_idx, part in enumerate(range_parts, start=1):
                        indices = []
                        if "-" in part:
                            subparts = part.split("-", 1)
                            start_str = subparts[0].strip()
                            end_str = subparts[1].strip()
                            start = int(start_str) if start_str.isdigit() else 1
                            end = total_pages if end_str.lower() == "end" else (int(end_str) if end_str.isdigit() else total_pages)
                            start = max(1, min(start, total_pages))
                            end = max(1, min(end, total_pages))
                            indices = list(range(start - 1, end))
                        else:
                            try:
                                v = int(part)
                                if 1 <= v <= total_pages:
                                    indices = [v - 1]
                            except ValueError:
                                pass

                        if not indices:
                            continue

                        seg_doc = fitz.open()
                        for p_idx in indices:
                            seg_doc.insert_pdf(doc, from_page=p_idx, to_page=p_idx)
                        label = part.replace("-", "_").replace(" ", "")
                        temp_file = output_path.parent / f"part{seg_idx}_pages_{label}.pdf"
                        seg_doc.save(str(temp_file), garbage=4, deflate=True)
                        seg_doc.close()
                        zipf.write(temp_file, arcname=f"part{seg_idx}_pages_{label}.pdf")
                        temp_file.unlink(missing_ok=True)

                return zip_path

            else:
                # mode == 'range' (default): extract selected pages into a single PDF
                selected_indices = set()
                parts = page_range_str.split(",")
                for part in parts:
                    part = part.strip()
                    if not part:
                        continue
                    if "-" in part:
                        subparts = part.split("-", 1)
                        start_str = subparts[0].strip()
                        end_str = subparts[1].strip()
                        start = int(start_str) if start_str.isdigit() else 1
                        end = total_pages if end_str.lower() == "end" else (int(end_str) if end_str.isdigit() else total_pages)
                        start = max(1, min(start, total_pages))
                        end = max(1, min(end, total_pages))
                        for p in range(start, end + 1):
                            selected_indices.add(p - 1)
                    else:
                        try:
                            val = int(part)
                            if 1 <= val <= total_pages:
                                selected_indices.add(val - 1)
                        except ValueError:
                            pass

                if not selected_indices:
                    selected_indices = set(range(total_pages))

                split_doc = fitz.open()
                for p_idx in sorted(selected_indices):
                    split_doc.insert_pdf(doc, from_page=p_idx, to_page=p_idx)
                split_doc.save(str(output_path), garbage=4, deflate=True)
                split_doc.close()
                return output_path

        return output_path

    @staticmethod
    def organize_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Reorders, deletes, and duplicates pages.
        options['order'] is a list of 0-based page indices in the target order.
        e.g., [2, 0, 1, 1] means page 3, then page 1, then page 2, then page 2 again.
        """
        order = options.get("order", [])
        with fitz.open(input_path) as doc:
            total_pages = len(doc)
            if not order:
                order = list(range(total_pages))

            new_doc = fitz.open()
            for idx in order:
                if 0 <= idx < total_pages:
                    new_doc.insert_pdf(doc, from_page=idx, to_page=idx)
            
            new_doc.save(str(output_path), garbage=4, deflate=True)
            new_doc.close()
        return output_path

    @staticmethod
    def rotate_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """Rotates pages by angle (90, 180, 270). Can apply to all, odd, even, or specific pages."""
        angle = int(options.get("angle", 90))
        target = options.get("target", "all")  # 'all', 'odd', 'even', or comma-separated numbers

        with fitz.open(input_path) as doc:
            total_pages = len(doc)
            for i in range(total_pages):
                page_num = i + 1
                should_rotate = False
                if target == "all":
                    should_rotate = True
                elif target == "odd" and page_num % 2 != 0:
                    should_rotate = True
                elif target == "even" and page_num % 2 == 0:
                    should_rotate = True
                elif isinstance(target, list) and page_num in target:
                    should_rotate = True

                if should_rotate:
                    page = doc[i]
                    page.set_rotation((page.rotation + angle) % 360)

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

    @staticmethod
    def add_page_numbers(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Inserts customizable page numbers at specified position.
        Positions: 'bottom-center', 'bottom-right', 'bottom-left', 'top-center', 'top-right', 'top-left'
        """
        pos = options.get("position", "bottom-center")
        font_size = float(options.get("font_size", 10.0))
        format_str = options.get("format", "Page {n} of {total}")
        start_number = int(options.get("start", 1))

        with fitz.open(input_path) as doc:
            total = len(doc)
            for idx, page in enumerate(doc):
                n = start_number + idx
                text = format_str.replace("{n}", str(n)).replace("{total}", str(total))
                rect = page.rect
                
                # Calculate coordinates
                margin_x = 40
                margin_y = 30
                if pos == "bottom-center":
                    point = fitz.Point(rect.width / 2, rect.height - margin_y)
                    align = fitz.TEXT_ALIGN_CENTER
                elif pos == "bottom-right":
                    point = fitz.Point(rect.width - margin_x, rect.height - margin_y)
                    align = fitz.TEXT_ALIGN_RIGHT
                elif pos == "bottom-left":
                    point = fitz.Point(margin_x, rect.height - margin_y)
                    align = fitz.TEXT_ALIGN_LEFT
                elif pos == "top-center":
                    point = fitz.Point(rect.width / 2, margin_y)
                    align = fitz.TEXT_ALIGN_CENTER
                elif pos == "top-right":
                    point = fitz.Point(rect.width - margin_x, margin_y)
                    align = fitz.TEXT_ALIGN_RIGHT
                else:  # top-left
                    point = fitz.Point(margin_x, margin_y)
                    align = fitz.TEXT_ALIGN_LEFT

                # Insert text overlay
                text_rect = fitz.Rect(point.x - 100, point.y - 10, point.x + 100, point.y + 10)
                page.insert_textbox(text_rect, text, fontsize=font_size, fontname="helv", align=align, color=(0.2, 0.2, 0.2))

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

    @staticmethod
    def crop_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """Crops PDF margins (top, bottom, left, right in points or percentages)."""
        top = float(options.get("top", 20))
        bottom = float(options.get("bottom", 20))
        left = float(options.get("left", 20))
        right = float(options.get("right", 20))

        with fitz.open(input_path) as doc:
            for page in doc:
                r = page.rect
                new_rect = fitz.Rect(
                    r.x0 + left,
                    r.y0 + top,
                    max(r.x0 + left + 10, r.x1 - right),
                    max(r.y0 + top + 10, r.y1 - bottom)
                )
                page.set_cropbox(new_rect)
            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

organize_processor = OrganizeProcessor()
