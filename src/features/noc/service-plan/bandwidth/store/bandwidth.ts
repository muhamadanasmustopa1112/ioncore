import { create } from "zustand";

interface BandwidthState {
  form: "new" | "edit" | "details" | null;
  bandwidthSheetOpen: boolean;
  openBandwidthFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeBandwidthFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setBandwidthFormSheetOpen: (open: boolean) => void;
}

const useBandwidthStore = create<BandwidthState>((set) => ({
  form: "new",
  bandwidthSheetOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setBandwidthFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, bandwidthSheetOpen: open })),
  openBandwidthFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, bandwidthSheetOpen: true, form })),
  closeBandwidthFormSheet: () =>
    set((state) => ({ ...state, bandwidthSheetOpen: false, form: null })),
}));

export { useBandwidthStore };
