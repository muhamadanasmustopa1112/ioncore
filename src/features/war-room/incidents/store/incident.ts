import { create } from "zustand";

interface Incident {
  id: string;
  incident_name: string;
  severity: string;
  status: string;
  created_at: string;
}

interface IncidentState {
  selectedItem: Incident | null;
  setSelectedItem: (item: Incident | null) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  selectedItem: null,
  setSelectedItem: (selectedItem) => set((state) => ({ ...state, selectedItem })),
}));
