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

  // Extract the raw data
  const rawData = query.data;
  
  // Force it into an array format
  const safeDocuments = Array.isArray(rawData) 
    ? rawData 
    : (rawData as any)?.documents || (rawData as any)?.data || [];

  return {
    //documents: query.data ?? [],
    documents : safeDocuments,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    deleteDocument: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}