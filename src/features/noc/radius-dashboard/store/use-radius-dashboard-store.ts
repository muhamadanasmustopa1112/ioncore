import { create } from "zustand";
import { RadiusDashboardFilters, RadiusKpi, NasPerformance, RadiusLog, RadiusServiceInfo } from "../types/radius-dashboard";
import { RADIUS_KPI, NAS_PERFORMANCE, RADIUS_LOGS, RADIUS_SERVICE_INFO } from "../data/mock-radius-data";

interface RadiusDashboardState {
  // Data
  kpi: RadiusKpi;
  nasPerformance: NasPerformance[];
  logs: RadiusLog[];
  serviceInfo: RadiusServiceInfo;
  
  // UI State
  filters: RadiusDashboardFilters;
  isLoading: boolean;
  
  // Actions
  setFilters: (filters: Partial<RadiusDashboardFilters>) => void;
  refreshData: () => Promise<void>;
}

export const useRadiusDashboardStore = create<RadiusDashboardState>((set) => ({
  kpi: RADIUS_KPI,
  nasPerformance: NAS_PERFORMANCE,
  logs: RADIUS_LOGS,
  serviceInfo: RADIUS_SERVICE_INFO,
  
  isLoading: false,
  filters: {
    dateRange: null,
    status: 'all',
  },
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  refreshData: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
  }
}));
