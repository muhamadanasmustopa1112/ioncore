import { create } from "zustand";
import type { InventoryValuationConfig } from "../types";

interface InventoryConfigState {
  form: "new" | "edit" | "details" | null;
  sheetOpen: boolean;
  selectedConfig: InventoryValuationConfig | null;
  openFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeFormSheet: () => void;
  setSelectedConfig: (config: InventoryValuationConfig | null) => void;
}

export const useInventoryConfigStore = create<InventoryConfigState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedConfig: null,
  openFormSheet: (form) =>
    set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () =>
    set((state) => ({ ...state, sheetOpen: false, form: null })),
  setSelectedConfig: (config) =>
    set((state) => ({ ...state, selectedConfig: config })),
}));
