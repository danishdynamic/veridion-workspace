import { api } from "@/lib/axios";
import { ComplianceQuery, ComplianceResult } from "@/types/query";

export async function queryCompliance(
  payload: ComplianceQuery
): Promise<ComplianceResult[]> {
  const response = await api.post<ComplianceResult[]>(
    "/retrieve/query",
    payload
  );
  return response.data;
}