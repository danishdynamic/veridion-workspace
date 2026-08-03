import { useMutation } from "@tanstack/react-query";
import { queryCompliance } from "@/api/query";
import { ComplianceQuery, ComplianceResult } from "@/types/query";

export function useQueryCompliance() {
  return useMutation<ComplianceResult[], Error, ComplianceQuery>({
    mutationFn: queryCompliance,
  });
}