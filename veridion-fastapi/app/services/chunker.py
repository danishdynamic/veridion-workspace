# services/chunker.py
import re
import uuid
from typing import Any, Dict, List


class LegalHierarchyChunker:
    """
    Parses legal/compliance documents into a strict 4-tier structural tree:
    Document -> Version -> Section (Chapter/Section) -> Clause (Article/Paragraph/Bullet)
    """

    def __init__(self, max_clause_tokens: int = 400):
        self.max_clause_tokens = max_clause_tokens

        # Regex definitions for structural legal headers
        self.chapter_pattern = re.compile(
            r'^(CHAPTER|TITLE)\s+([IVXLCDM\d]+)[:\.\s]*(.*)$', re.IGNORECASE
        )
        self.section_pattern = re.compile(
            r'^(SECTION)\s+(\d+|[IVXLCDM]+)[:\.\s]*(.*)$', re.IGNORECASE
        )
        self.article_pattern = re.compile(
            r'^(ARTICLE|CLAUSE)\s+(\d+|[IVXLCDM]+)[:\.\s]*(.*)$', re.IGNORECASE
        )
        self.paragraph_pattern = re.compile(
            r'^(?:\(?(\d+|[a-z])\)?[\.\s])\s*(.*)$'
        )
        self.bullet_pattern = re.compile(
            r'^(?:[•\-–*]|\(([i|v|x]+)\))\s*(.*)$', re.IGNORECASE
        )

    def _clean_line(self, text: str) -> str:
        return re.sub(r'\s+', ' ', text).strip()

    def parse_legal_tree(self, raw_text: str) -> List[Dict[str, Any]]:
        """
        Parses unformatted legal text into structured Section and Clause entities.
        
        Returns:
            List of Section dicts containing nested Clause entities for direct DB insertion.
        """
        lines = [self._clean_line(line) for line in raw_text.splitlines() if line.strip()]

        sections: List[Dict[str, Any]] = []
        current_section = {
            "section_id": str(uuid.uuid4()),
            "title": "General Provisions",
            "section_number": "1.0",
            "clauses": []
        }

        current_article_title = "Preamble"
        current_article_num = "0"
        current_clause_buffer: List[str] = []
        clause_sequence = 0

        def flush_clause_buffer():
            nonlocal current_clause_buffer, clause_sequence
            if not current_clause_buffer:
                return

            clause_text = "\n".join(current_clause_buffer).strip()
            if not clause_text:
                return

            clause_sequence += 1
            current_section["clauses"].append({
                "clause_id": str(uuid.uuid4()),
                "clause_number": f"{current_article_num}.{clause_sequence}",
                "title": current_article_title,
                "text": clause_text,
                "token_estimate": int(len(clause_text.split()) * 1.3)
            })
            current_clause_buffer = []

        for line in lines:
            # 1. Match Chapter / Section (Creates top-level Section)
            chap_match = self.chapter_pattern.match(line)
            sec_match = self.section_pattern.match(line)
            header_match = chap_match or sec_match

            if header_match is not None:
                flush_clause_buffer()
                
                # Single if statement combined with `and` to avoid nested conditions
                if current_section["clauses"] and len(current_section["clauses"]) > 0:
                    sections.append(current_section)

                prefix = header_match.group(1).upper()
                num = header_match.group(2)
                title = header_match.group(3) or "Untitled"

                current_section = {
                    "section_id": str(uuid.uuid4()),
                    "title": f"{prefix} {num}: {title}".strip(" :"),
                    "section_number": num,
                    "clauses": []
                }
                clause_sequence = 0
                continue

            # 2. Match Article / Clause Boundary
            art_match = self.article_pattern.match(line)
            if art_match is not None:
                flush_clause_buffer()
                prefix = art_match.group(1).capitalize()
                current_article_num = art_match.group(2)
                current_article_title = f"{prefix} {current_article_num}: {art_match.group(3)}".strip(" :")
                continue

            # 3. Match Paragraphs / Sub-articles / Bullets
            para_match = self.paragraph_pattern.match(line)
            bullet_match = self.bullet_pattern.match(line)

            # Combined single `if` statement using `and` to avoid nesting
            if (para_match is not None or bullet_match is not None) and current_clause_buffer and (len(" ".join(current_clause_buffer).split()) * 1.3 > self.max_clause_tokens):
                flush_clause_buffer()

            current_clause_buffer.append(line)

        # Flush final remaining buffers
        flush_clause_buffer()
        if current_section["clauses"] and len(current_section["clauses"]) > 0:
            sections.append(current_section)

        return sections