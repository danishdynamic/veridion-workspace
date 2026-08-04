import { create } from "zustand";

interface EvaluationStoreState {
  selectedDate: string;
  selectedDocument: string;
  selectedVersion: string;
  selectedIndustry: string;
  minimumScore: number;
  showFailuresOnly: boolean;
  autoRefresh: boolean;
  searchQuery: string;

  // Actions
  setDate: (date: string) => void;
  setDocument: (document: string) => void;
  setVersion: (version: string) => void;
  setIndustry: (industry: string) => void;
  setMinimumScore: (score: number) => void;
  toggleFailures: () => void;
  toggleRefresh: () => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

const initialFilters = {
  selectedDate: "7d",
  selectedDocument: "all",
  selectedVersion: "all",
  selectedIndustry: "all",
  minimumScore: 0,
  showFailuresOnly: false,
  autoRefresh: false,
  searchQuery: "",
};

export const useEvaluationStore = create<EvaluationStoreState>((set) => ({
  ...initialFilters,

  setDate: (selectedDate) => set({ selectedDate }),
  setDocument: (selectedDocument) => set({ selectedDocument }),
  setVersion: (selectedVersion) => set({ selectedVersion }),
  setIndustry: (selectedIndustry) => set({ selectedIndustry }),
  setMinimumScore: (minimumScore) => set({ minimumScore }),
  toggleFailures: () => set((s) => ({ showFailuresOnly: !s.showFailuresOnly })),
  toggleRefresh: () => set((s) => ({ autoRefresh: !s.autoRefresh })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  resetFilters: () => set({ ...initialFilters }),
}));