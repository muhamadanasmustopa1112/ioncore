import { create } from "zustand";
import { OltData } from "../types/olt";

interface OltState {
  form: "new" | "edit" | "details" | null;
  oltSheetOpen: boolean;
  selectedOlt: OltData | null;
  openOltFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeOltFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setOltFormSheetOpen: (open: boolean) => void;
  setSelectedOlt: (olt: OltData | null) => void;
}

export const useOltStore = create<OltState>((set) => ({
  form: "new",
  oltSheetOpen: false,
  selectedOlt: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setOltFormSheetOpen: (open) =>
    set((state) => ({ ...state, oltSheetOpen: open })),
  openOltFormSheet: (form) =>
    set((state) => ({ ...state, oltSheetOpen: true, form })),
  closeOltFormSheet: () =>
    set((state) => ({ ...state, oltSheetOpen: false, form: null })),
  setSelectedOlt: (olt) =>
    set((state) => ({ ...state, selectedOlt: olt })),
}));
