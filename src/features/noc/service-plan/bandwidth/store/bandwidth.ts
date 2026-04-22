import { create } from "zustand";
import { BandwidthItem } from "../types";

interface BandwidthState {
  form: "new" | "edit" | "details" | null;
  bandwidthSheetOpen: boolean;
  selectedBandwidth: BandwidthItem | null;
  openBandwidthFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeBandwidthFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setBandwidthFormSheetOpen: (open: boolean) => void;
  setSelectedBandwidth: (bandwidth: BandwidthItem | null) => void;
}

const useBandwidthStore = create<BandwidthState>((set) => ({
  form: "new",
  bandwidthSheetOpen: false,
  selectedBandwidth: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setBandwidthFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, bandwidthSheetOpen: open })),
  openBandwidthFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, bandwidthSheetOpen: true, form })),
  closeBandwidthFormSheet: () =>
    set((state) => ({ ...state, bandwidthSheetOpen: false, form: null, selectedBandwidth: null })),
  setSelectedBandwidth: (bandwidth) => set((state) => ({ ...state, selectedBandwidth: bandwidth })),
}));

export { useBandwidthStore };
