import { api } from "@/lib/axios";
import { Document, UploadDocumentRequest, UploadResponse } from "@/types/document";

export const documentsApi = {
  upload: async (
    data: UploadDocumentRequest,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("versionTag", data.versionTag);
    formData.append("sector", data.sector);
    formData.append("region", data.region);
    formData.append("file", data.file);

    const response = await api.post<UploadResponse>("/api/v1/ingest/upload", formData, {
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

  getAll: async (): Promise<Document[]> => {
    const response = await api.get<Document[]>("/api/v1/documents");
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete<{ success: boolean }>(`/api/v1/documents/${id}`);
    return response.data;
  },

  versions: async (title: string): Promise<Document[]> => {
    const response = await api.get<Document[]>(`/api/v1/documents/versions?title=${encodeURIComponent(title)}`);
    return response.data;
  },
};