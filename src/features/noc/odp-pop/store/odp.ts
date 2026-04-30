import { create } from "zustand";
import { OdpData } from "../types/odp";

interface OdpState {
  form: "new" | "edit" | "details" | null;
  odpSheetOpen: boolean;
  selectedOdp: OdpData | null;
  openOdpFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeOdpFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setOdpFormSheetOpen: (open: boolean) => void;
  setSelectedOdp: (odp: OdpData | null) => void;
}

export const useOdpStore = create<OdpState>((set) => ({
  form: "new",
  odpSheetOpen: false,
  selectedOdp: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setOdpFormSheetOpen: (open) =>
    set((state) => ({ ...state, odpSheetOpen: open })),
  openOdpFormSheet: (form) =>
    set((state) => ({ ...state, odpSheetOpen: true, form })),
  closeOdpFormSheet: () =>
    set((state) => ({ ...state, odpSheetOpen: false, form: null })),
  setSelectedOdp: (odp) =>
    set((state) => ({ ...state, selectedOdp: odp })),
}));
