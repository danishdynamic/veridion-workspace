import { documentsApi } from "@/api/documents";
import { UploadDocumentRequest } from "@/types/document";

export async function uploadDocumentAction(
  data: UploadDocumentRequest,
  onProgress?: (progress: number) => void
) {
  return await documentsApi.upload(data, onProgress);
}

export async function getDocumentsAction() {
  return await documentsApi.getAll();
}

export async function deleteDocumentAction(id: string) {
  return await documentsApi.delete(id);
}

export async function getVersionsAction(title: string) {
  return await documentsApi.versions(title);
}