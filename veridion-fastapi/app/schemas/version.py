# app/schemas/version.py
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class ChangeType(str, Enum):
    NEW = "NEW"
    MODIFIED = "MODIFIED"
    REMOVED = "REMOVED"
    UNCHANGED = "UNCHANGED"


class VersionCompareRequest(BaseModel):
    document_id: Optional[str] = Field(None, description="ID of the document to compare versions for")
    version_a_id: str = Field(..., description="Baseline version ID (e.g., v1.0 / 2022)")
    version_b_id: str = Field(..., description="Target version ID (e.g., v2.0 / 2025)")
    section_id: Optional[str] = Field(None, description="Optional filter for specific section")


class ClauseChangeResponse(BaseModel):
    clause_number: Optional[str]
    change_type: ChangeType
    old_text: Optional[str] = None
    new_text: Optional[str] = None
    impact_assessment: str


class VersionCompareResponse(BaseModel):
    version_a_id: str
    version_b_id: str
    has_diffs: bool
    changes: List[ClauseChangeResponse]