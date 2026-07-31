import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocumentsAction, deleteDocumentAction } from "@/store/documents";

export function useDocuments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["documents"],
    queryFn: async () => await getDocumentsAction(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => await deleteDocumentAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}