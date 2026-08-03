import { useMutation } from "@tanstack/react-query";
import { uploadDocument } from "@/api/documents";
import { UploadDocumentRequest, UploadDocumentResponse } from "@/types/document";

interface UseUploadOptions {
  onProgress?: (progress: number) => void;
}

export function useUpload(options?: UseUploadOptions) {
  return useMutation<UploadDocumentResponse, Error, UploadDocumentRequest>({
    mutationFn: (data: UploadDocumentRequest) =>
      uploadDocument(data, options?.onProgress),
  });
}