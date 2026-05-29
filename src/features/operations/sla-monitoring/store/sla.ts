import { create } from "zustand";

import type { SlaMetric } from "../types";

interface SlaState {
  selectedMetric: SlaMetric | null;
  areaFilter: string | null;
  setSelectedMetric: (metric: SlaMetric | null) => void;
  setAreaFilter: (area: string | null) => void;
}

const useSlaStore = create<SlaState>((set) => ({
  selectedMetric: null,
  areaFilter: null,
  setSelectedMetric: (metric) => set({ selectedMetric: metric }),
  setAreaFilter: (area) => set({ areaFilter: area }),
}));

export { useSlaStore };
