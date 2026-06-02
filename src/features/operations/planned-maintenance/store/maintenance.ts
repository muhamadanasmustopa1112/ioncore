import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MaintenanceEvent, MaintenanceAffectedArea, MaintenanceImpactedNode } from "../types";

type FormMode = "new" | "edit" | "details" | "approval" | null;

interface MaintenanceState {
  sheetOpen: boolean;
  form: FormMode;
  selectedMaintenance: MaintenanceEvent | null;
  formAreas: MaintenanceAffectedArea[];
  formNodes: MaintenanceImpactedNode[];
  openFormSheet: (form: FormMode) => void;
  closeFormSheet: () => void;
  setSelectedMaintenance: (maintenance: MaintenanceEvent | null) => void;
  setFormAreas: (areas: MaintenanceAffectedArea[]) => void;
  setFormNodes: (nodes: MaintenanceImpactedNode[]) => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  sheetOpen: false,
  form: null,
  selectedMaintenance: null,
  formAreas: [],
  formNodes: [],
  openFormSheet: (form) => set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () => set((state) => ({ ...state, sheetOpen: false, form: null, selectedMaintenance: null, formAreas: [], formNodes: [] })),
  setSelectedMaintenance: (maintenance) => set((state) => ({ ...state, selectedMaintenance: maintenance })),
  setFormAreas: (areas) => set((state) => ({ ...state, formAreas: areas })),
  setFormNodes: (nodes) => set((state) => ({ ...state, formNodes: nodes })),
}));
