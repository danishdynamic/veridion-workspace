import re
from typing import List, Dict, Any
import uuid

class HierarchicalComplianceChunker:
    def __init__(self, parent_size: int = 2000, child_size: int = 400, overlap: int = 50):
        self.parent_size = parent_size
        self.child_size = child_size
        self.overlap = overlap

    def _clean_text(self, text: str) -> str:
        """Standardizes whitespaces and normalizes document characters."""
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    def _split_into_sentences(self, text: str) -> List[str]:
        """Splits regulatory text by sentence boundaries while preserving article markers."""
        # Avoid splitting on common legal abbreviations like 'Art.' or 'e.g.'
        sentence_end = re.compile(r'(?<!\bArt)(?<!\be\.g)(?<!\bi\.e)\.\s+')
        sentences = sentence_end.split(text)
        return [s.strip() + "." for s in sentences if s.strip()]

    def _chunk_tokens(self, text: str, max_tokens: int) -> List[str]:
        """Fallback character/word-based chunking framework window."""
        words = text.split(' ')
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            # Approximate token allocation sizing (1 word ~ 1.3 tokens)
            word_cost = int(len(word) / 4) + 1
            if current_length + word_cost > max_tokens:
                chunks.append(" ".join(current_chunk))
                # Retain partial window overlap
                current_chunk = current_chunk[-self.overlap:] if len(current_chunk) > self.overlap else current_chunk
                current_length = sum([int(len(w) / 4) + 1 for w in current_chunk])
            
            current_chunk.append(word)
            current_length += word_cost
            
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        return chunks

    def generate_hierarchy(self, raw_text: str) -> List[Dict[str, Any]]:
        """
        Parses raw text structures down into isolated Parent blocks,
        and then recursively populates smaller child vectors maps underneath them.
        """
        cleaned_text = self._clean_text(raw_text)
        
        # 1. Structural Generation: Segment text roughly into Parent blocks
        # In a compliance setting, we look for Article boundaries first
        article_split_pattern = r'(?=Article\s+\d+|ANNEX\s+[I|V|X]+)'
        raw_parent_blocks = re.split(article_split_pattern, cleaned_text, flags=re.IGNORECASE)
        
        parent_chunks = []
        for block in raw_parent_blocks:
            if not block.strip():
                continue
            # If an article is massive, hard-split it by token allowance boundaries
            if len(block.split()) * 1.3 > self.parent_size:
                parent_chunks.extend(self._chunk_tokens(block, self.parent_size))
            else:
                parent_chunks.append(block.strip())

        processed_hierarchy = []

        # 2. Child Generation: Loop through mapped Parents to extract sub-chunks
        for parent_text in parent_chunks:
            parent_id = str(uuid.uuid4())
            sentences = self._split_into_sentences(parent_text)
            
            child_chunks = []
            current_child = ""
            
            for sentence in sentences:
                # Check if adding the sentence exceeds child boundary limits
                if len((current_child + " " + sentence).split()) * 1.3 > self.child_size:
                    if current_child.strip():
                        child_chunks.append(current_child.strip())
                    current_child = sentence
                else:
                    current_child = (current_child + " " + sentence).strip()
            
            if current_child.strip():
                child_chunks.append(current_child.strip())
                
            # Fallback if sentence parsing failed to yield blocks
            if not child_chunks:
                child_chunks = self._chunk_tokens(parent_text, self.child_size)

            processed_hierarchy.append({
                "parent_id": parent_id,
                "parent_text": parent_text,
                "children": [{"child_text": child} for child in child_chunks]
            })

        return processed_hierarchy