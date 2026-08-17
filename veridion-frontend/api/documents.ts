// veridion-frontend/api/documents.ts
import axios from "axios";
import { api } from "@/lib/axios";
import { Document, DocumentVersion, UploadDocumentRequest } from "@/types/document";
import { UploadResponse } from "@/types/upload";

// Base URL for direct FastAPI uploads
const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

export const documentsApi = {
  // POST /api/v1/ingest/upload directly to FastAPI
  upload: async (
    data: UploadDocumentRequest,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("versionTag", data.version || "1.0.0");
    formData.append("sector", data.sector);
    formData.append("region", data.region);
    formData.append("file", data.file);

    // Call FastAPI directly instead of Node orchestrator
    const response = await axios.post<UploadResponse>(
      `${FASTAPI_URL}/api/v1/ingest/upload`,
      formData,
      {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      }
    );

    return response.data;
  },

  // GET /versions (routed to Node orchestrator)
  getVersions: async (): Promise<DocumentVersion[]> => {
    const response = await api.get<DocumentVersion[]>("/versions");
    return response.data;
  },

  // DELETE /versions/:id (routed to Node orchestrator)
  deleteVersion: async (id: string): Promise<void> => {
    await api.delete(`/versions/${id}`);
  },

  // GET /documents (routed to Node orchestrator)
  getAll: async (): Promise<Document[]> => {
    const response = await api.get("/documents");
    const data = response.data;
    
    // Safely extract the array regardless of how FastAPI wrapped it
    return Array.isArray(data) ? data : data.documents || data.data || [];
  },

  // DELETE /documents/:id (routed to Node orchestrator)
  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/documents/${id}`);
    return response.data;
  },

  // GET /documents/versions?title=... (routed to Node orchestrator)
  getByTitle: async (title: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(
      `/documents/versions?title=${encodeURIComponent(title)}`
    );
    return response.data;
  },
};

// Standalone function exports for direct hook imports
export const uploadDocument = documentsApi.upload;
export const getVersions = documentsApi.getVersions;
export const deleteVersion = documentsApi.deleteVersion;