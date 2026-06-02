import { create } from "zustand";
import type { Vendor } from "../types/vendor";

interface VendorState {
  form: "new" | "edit" | "details";
  sheetOpen: boolean;
  selectedItem: Vendor | null;
  openFormSheet: (form: "new" | "edit" | "details") => void;
  closeFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details") => void;
  setSheetOpen: (open: boolean) => void;
  setSelectedItem: (item: Vendor | null) => void;
}

export const useVendorStore = create<VendorState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedItem: null,
  openFormSheet: (form) => set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () => set((state) => ({ ...state, sheetOpen: false, form: "new", selectedItem: null })),
  setForm: (form) => set((state) => ({ ...state, form })),
  setSheetOpen: (sheetOpen) => set((state) => ({ ...state, sheetOpen })),
  setSelectedItem: (selectedItem) => set((state) => ({ ...state, selectedItem })),
}));
