export interface UploadDocumentRequest {
  title: string;
  versionTag: string;
  sector: string;
  region: string;
  file: File;
}

export interface UploadResponse {
  status: string;
  parentId: string;
  totalChunksIndexed: number;
}