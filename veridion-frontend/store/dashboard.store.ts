import { create } from "zustand";

interface DashboardStoreState {
  selectedIndustry: string;
  selectedCountry: string;
  selectedVersion: string;
  selectedDateRange: "7d" | "30d" | "90d" | "1y";
  refreshInterval: number; // in milliseconds (0 = off)
  chartType: "bar" | "line" | "area";

  setIndustry: (industry: string) => void;
  setCountry: (country: string) => void;
  setVersion: (version: string) => void;
  setDateRange: (range: "7d" | "30d" | "90d" | "1y") => void;
  setChartType: (type: "bar" | "line" | "area") => void;
  toggleRefresh: (ms?: number) => void;
  reset: () => void;
}

const initialState = {
  selectedIndustry: "ALL",
  selectedCountry: "ALL",
  selectedVersion: "ALL",
  selectedDateRange: "30d" as const,
  refreshInterval: 0,
  chartType: "bar" as const,
};

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  ...initialState,

  setIndustry: (selectedIndustry) => set({ selectedIndustry }),
  setCountry: (selectedCountry) => set({ selectedCountry }),
  setVersion: (selectedVersion) => set({ selectedVersion }),
  setDateRange: (selectedDateRange) => set({ selectedDateRange }),
  setChartType: (chartType) => set({ chartType }),
  toggleRefresh: (ms = 30000) =>
    set((state) => ({ refreshInterval: state.refreshInterval === 0 ? ms : 0 })),
  reset: () => set({ ...initialState }),
}));