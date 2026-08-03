import { create } from "zustand";
import { ComplianceQuery, ComplianceResult } from "@/types/query";

interface QueryState {
  lastQuery: ComplianceQuery | null;
  results: ComplianceResult[];
  selectedResult: ComplianceResult | null;
  loading: boolean;
  setResults: (query: ComplianceQuery, results: ComplianceResult[]) => void;
  setSelectedResult: (result: ComplianceResult | null) => void;
  setLoading: (loading: boolean) => void;
  clearResults: () => void;
}

export const useQueryStore = create<QueryState>((set) => ({
  lastQuery: null,
  results: [],
  selectedResult: null,
  loading: false,
  setResults: (lastQuery, results) => set({ lastQuery, results }),
  setSelectedResult: (selectedResult) => set({ selectedResult }),
  setLoading: (loading) => set({ loading }),
  clearResults: () => set({ lastQuery: null, results: [], selectedResult: null }),
}));