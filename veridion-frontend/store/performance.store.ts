import { create } from "zustand";
import { ServiceType, DateRangeType } from "@/schemas/performance.schema";

interface PerformanceStoreState {
  selectedRange: DateRangeType;
  selectedService: ServiceType;
  liveRefresh: boolean;
  selectedBenchmark: string | null;
  showOnlyWarnings: boolean;
  autoOptimize: boolean;
  benchmarkRunning: boolean;

  setRange: (range: DateRangeType) => void;
  setService: (service: ServiceType) => void;
  toggleLive: () => void;
  toggleWarnings: () => void;
  toggleAutoOptimize: () => void;
  setSelectedBenchmark: (id: string | null) => void;
  setBenchmarkRunning: (running: boolean) => void;
}

export const usePerformanceStore = create<PerformanceStoreState>((set) => ({
  selectedRange: "24h",
  selectedService: "all",
  liveRefresh: true,
  selectedBenchmark: null,
  showOnlyWarnings: false,
  autoOptimize: false,
  benchmarkRunning: false,

  setRange: (range) => set({ selectedRange: range }),
  setService: (service) => set({ selectedService: service }),
  toggleLive: () => set((state) => ({ liveRefresh: !state.liveRefresh })),
  toggleWarnings: () => set((state) => ({ showOnlyWarnings: !state.showOnlyWarnings })),
  toggleAutoOptimize: () => set((state) => ({ autoOptimize: !state.autoOptimize })),
  setSelectedBenchmark: (id) => set({ selectedBenchmark: id }),
  setBenchmarkRunning: (running) => set({ benchmarkRunning: running }),
}));