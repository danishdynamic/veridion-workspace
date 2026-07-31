export type DocumentStatus = "ACTIVE" | "ARCHIVED";

export interface DocumentVersion {
  id: string;
  title: string;
  version: string;
  sector: string;
  region: string;
  status: DocumentStatus;
  updatedAt: string;
}

export type Document = DocumentVersion;

export interface DocumentVersionCardProps {
  id: string;
  title: string;
  version: string;
  status: DocumentStatus;
  updatedAt: string;
  sector: string;
  region: string;
  onView?: () => void;
}

export interface DocumentTableProps {
  documents: DocumentVersion[];
  loading?: boolean;
  onView?: (id: string) => void;
  onCompare?: (id: string) => void;
  onDelete?: (id: string) => void;
}


export interface UploadDocumentRequest {
  file: File;
  title: string;
  version: string;
  sector: string;
  region: string;
}

// Response returned from FastAPI after a successful upload
export interface UploadDocumentResponse {
  message: string;
  document: DocumentVersion;
}