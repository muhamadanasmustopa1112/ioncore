import { create } from "zustand";
import type { Ewo } from "../types/ewo";

interface EwoState {
  form: "new" | "edit" | "details";
  sheetOpen: boolean;
  selectedItem: Ewo | null;
  openFormSheet: (form: "new" | "edit" | "details") => void;
  closeFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details") => void;
  setSheetOpen: (open: boolean) => void;
  setSelectedItem: (item: Ewo | null) => void;
}

export const useEwoStore = create<EwoState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedItem: null,
  openFormSheet: (form) => set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () => set((state) => ({ ...state, sheetOpen: false, form: "new", selectedItem: null })),
  setForm: (form) => set((state) => ({ ...state, form })),
  setSheetOpen: (sheetOpen) => set((state) => ({ ...state, sheetOpen })),
  setSelectedItem: (selectedItem) => set((state) => ({ ...state, selectedItem })),
}));
