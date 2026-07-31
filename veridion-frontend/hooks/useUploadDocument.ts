import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocumentAction } from "@/store/documents";
import { UploadDocumentRequest } from "@/types/document";
import { useUploadStore } from "@/store/upload.store";

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { setProgress, startUpload, finishUpload, setError } = useUploadStore();

  return useMutation({
    mutationFn: async (data: UploadDocumentRequest) => {
      startUpload();
      return await uploadDocumentAction(data, (percent) => setProgress(percent));
    },
    onSuccess: () => {
      finishUpload();
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to upload regulation document.");
    },
  });
}