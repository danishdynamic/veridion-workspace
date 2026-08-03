import { useQuery } from "@tanstack/react-query";
import { getVersions } from "@/api/documents";

export function useVersions() {
  return useQuery({
    queryKey: ["versions"],
    queryFn: getVersions,
  });
}