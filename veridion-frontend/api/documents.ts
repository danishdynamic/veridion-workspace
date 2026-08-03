import { api } from "@/lib/axios";
import { Document, DocumentVersion, UploadDocumentRequest } from "@/types/document";
import { UploadResponse } from "@/types/upload";

export const documentsApi = {
  // POST /upload with upload progress tracking
  upload: async (
    data: UploadDocumentRequest,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("versionTag", data.version || "");
    formData.append("sector", data.sector);
    formData.append("region", data.region);
    formData.append("file", data.file);

    const response = await api.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });

    return response.data;
  },

  // GET /versions
  getVersions: async (): Promise<DocumentVersion[]> => {
    const response = await api.get<DocumentVersion[]>("/versions");
    return response.data;
  },

  // DELETE /versions/:id
  deleteVersion: async (id: string): Promise<void> => {
    await api.delete(`/versions/${id}`);
  },

  // GET /documents
  getAll: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>("/documents");
    return response.data;
  },

  // DELETE /documents/:id
  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/documents/${id}`);
    return response.data;
  },

  // GET /documents/versions?title=...
  getByTitle: async (title: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(
      `/documents/versions?title=${encodeURIComponent(title)}`
    );
    return response.data;
  },
};

// Standalone function exports for direct hook imports (e.g. useVersions, useUpload)
export const uploadDocument = documentsApi.upload;
export const getVersions = documentsApi.getVersions;
export const deleteVersion = documentsApi.deleteVersion;