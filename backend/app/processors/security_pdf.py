import difflib
import fitz
from pathlib import Path
from typing import Dict, Any, List

class SecurityProcessor:
    @staticmethod
    def protect_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Encrypts PDF with user and optional owner password and permission restrictions.
        """
        user_password = options.get("password")
        owner_password = options.get("owner_password", user_password)
        if not user_password:
            raise ValueError("Password is required to protect the document.")

        with fitz.open(input_path) as doc:
            # Set encryption permissions
            # Permissions: 0 to restrict printing/copying, or custom flags
            permissions = fitz.PDF_PERM_ACCESSIBILITY | fitz.PDF_PERM_PRINT
            doc.save(
                str(output_path),
                encryption=fitz.PDF_ENCRYPT_AES_256,
                user_pw=user_password,
                owner_pw=owner_password,
                permissions=permissions
            )
        return output_path

    @staticmethod
    def unlock_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Removes password protection when valid password is provided.
        Never performs brute force or unauthorized bypass.
        """
        password = options.get("password", "")
        doc = fitz.open(input_path)
        
        if doc.is_encrypted:
            authenticated = doc.authenticate(password)
            if not authenticated:
                doc.close()
                raise ValueError("Incorrect password provided. Access denied.")

        # Save without encryption
        doc.save(str(output_path), encryption=fitz.PDF_ENCRYPT_KEEP)
        doc.close()
        return output_path

    @staticmethod
    def redact_pdf(input_path: Path, output_path: Path, options: Dict[str, Any]) -> Path:
        """
        Permanently purges sensitive text or target rectangles from PDF.
        Removes vector text objects from the file so it cannot be inspected or extracted.
        """
        terms_to_redact = options.get("terms", [])  # List of strings e.g. ["SSN", "Confidential", "Password"]
        if isinstance(terms_to_redact, str):
            terms_to_redact = [t.strip() for t in terms_to_redact.split(",") if t.strip()]

        with fitz.open(input_path) as doc:
            for page in doc:
                for term in terms_to_redact:
                    rects = page.search_for(term)
                    for r in rects:
                        annot = page.add_redact_annot(r, fill=(0, 0, 0))
                # Apply true permanent redaction
                page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_PIXELS)

            doc.save(str(output_path), garbage=4, deflate=True)
        return output_path

    @staticmethod
    def compare_pdf(doc1_path: Path, doc2_path: Path, output_path: Path) -> Dict[str, Any]:
        """
        Analyzes two PDF documents and returns structural and textual differences.
        Also produces a side-by-side comparison summary.
        """
        with fitz.open(doc1_path) as doc1, fitz.open(doc2_path) as doc2:
            p1_count = len(doc1)
            p2_count = len(doc2)

            text1 = "\n".join([page.get_text("text") for page in doc1])
            text2 = "\n".join([page.get_text("text") for page in doc2])

            lines1 = text1.splitlines()
            lines2 = text2.splitlines()

            diff = list(difflib.unified_diff(lines1, lines2, fromfile="Document A", tofile="Document B", lineterm=""))
            
            added_lines = [l[1:] for l in diff if l.startswith("+") and not l.startswith("+++")]
            removed_lines = [l[1:] for l in diff if l.startswith("-") and not l.startswith("---")]

            # Generate visual comparison report PDF
            summary_doc = fitz.open()
            page = summary_doc.new_page(width=595, height=842)
            page.draw_rect(fitz.Rect(0, 0, 595, 70), color=None, fill=(0.31, 0.27, 0.90))
            page.insert_text(fitz.Point(30, 42), "CrazyPDF Document Comparison Report", fontsize=16, color=(1, 1, 1), fontname="helv")

            y = 110
            page.insert_text(fitz.Point(30, y), f"Document A Pages: {p1_count}", fontsize=12, fontname="helv")
            y += 20
            page.insert_text(fitz.Point(30, y), f"Document B Pages: {p2_count}", fontsize=12, fontname="helv")
            y += 20
            page.insert_text(fitz.Point(30, y), f"Total Lines Added: {len(added_lines)}", fontsize=12, fontname="helv")
            y += 20
            page.insert_text(fitz.Point(30, y), f"Total Lines Removed: {len(removed_lines)}", fontsize=12, fontname="helv")
            y += 35

            page.insert_text(fitz.Point(30, y), "Top Changes Diff Excerpts:", fontsize=13, fontname="helv-bold")
            y += 25

            for line in diff[:25]:  # First 25 changes
                col = (0.1, 0.6, 0.2) if line.startswith("+") else ((0.8, 0.2, 0.2) if line.startswith("-") else (0.4, 0.4, 0.4))
                page.insert_text(fitz.Point(30, y), line[:80], fontsize=9, color=col, fontname="helv")
                y += 18
                if y > 800:
                    break

            summary_doc.save(str(output_path))
            summary_doc.close()

            return {
                "pages_a": p1_count,
                "pages_b": p2_count,
                "added_count": len(added_lines),
                "removed_count": len(removed_lines),
                "diff_sample": diff[:40]
            }

security_processor = SecurityProcessor()
