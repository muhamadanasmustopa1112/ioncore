import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MaintenanceEvent } from "../types";

interface MaintenanceState {
  sheetOpen: boolean;
  form: "new" | "edit" | "details" | null;
  selectedMaintenance: MaintenanceEvent | null;
  openFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeFormSheet: () => void;
  setSelectedMaintenance: (maintenance: MaintenanceEvent | null) => void;
}

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  sheetOpen: false,
  form: null,
  selectedMaintenance: null,
  openFormSheet: (form) => set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () => set((state) => ({ ...state, sheetOpen: false, form: null, selectedMaintenance: null })),
  setSelectedMaintenance: (maintenance) => set((state) => ({ ...state, selectedMaintenance: maintenance })),
}));

interface NodeSelectorState {
  selectedNodes: string[];
  searchQuery: string;
  setSelectedNodes: (nodes: string[]) => void;
  addNode: (nodeId: string) => void;
  removeNode: (nodeId: string) => void;
  clearNodes: () => void;
  setSearchQuery: (query: string) => void;
}

export const useNodeSelectorStore = create<NodeSelectorState>((set) => ({
  selectedNodes: [],
  searchQuery: "",
  setSelectedNodes: (nodes) => set((state) => ({ ...state, selectedNodes: nodes })),
  addNode: (nodeId) => set((state) => ({ ...state, selectedNodes: [...state.selectedNodes, nodeId] })),
  removeNode: (nodeId) => set((state) => ({ ...state, selectedNodes: state.selectedNodes.filter((id) => id !== nodeId) })),
  clearNodes: () => set((state) => ({ ...state, selectedNodes: [] })),
  setSearchQuery: (query) => set((state) => ({ ...state, searchQuery: query })),
}));
