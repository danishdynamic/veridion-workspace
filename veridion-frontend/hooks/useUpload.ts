import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "@/api/documents";
import { UploadDocumentRequest } from "@/types/document";
import { UploadResponse } from "@/types/upload"; 

interface UseUploadOptions {
  onProgress?: (progress: number) => void;
}

export function useUpload(options?: UseUploadOptions) {
  const queryClient = useQueryClient();

  return useMutation<UploadResponse, Error, UploadDocumentRequest>({
    mutationFn: (data: UploadDocumentRequest) =>
      uploadDocument(data, options?.onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}