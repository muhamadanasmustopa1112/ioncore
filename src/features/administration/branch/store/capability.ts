import { create } from "zustand";
import { CapabilityData, CapabilityFormMode } from "../types/capability";

interface CapabilityState {
  form: CapabilityFormMode;
  sheetOpen: boolean;
  selectedBranchId: string;
  selectedCapability: CapabilityData | null;
  openSheet: (form: CapabilityFormMode, capability?: CapabilityData) => void;
  closeSheet: () => void;
  setSelectedBranchId: (id: string) => void;
}

const useCapabilityStore = create<CapabilityState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedBranchId: "",
  selectedCapability: null,
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  openSheet: (form, capability) =>
    set({ sheetOpen: true, form, selectedCapability: capability ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedCapability: null }),
}));

export { useCapabilityStore };
