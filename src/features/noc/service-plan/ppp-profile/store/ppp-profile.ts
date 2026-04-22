import { create } from "zustand";

import { PPPProfileItem } from "../types/ppp-profile";

interface PPPProfileState {
  form: "new" | "edit" | "details" | null;
  pppProfileSheetOpen: boolean;
  selectedPPPProfile: PPPProfileItem | null;
  openPPPProfileFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closePPPProfileFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setPPPProfileSheetOpen: (open: boolean) => void;
  setSelectedPPPProfile: (profile: PPPProfileItem | null) => void;
}

const usePPPProfileStore = create<PPPProfileState>((set) => ({
  form: "new",
  pppProfileSheetOpen: false,
  selectedPPPProfile: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setPPPProfileSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, pppProfileSheetOpen: open })),
  openPPPProfileFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, pppProfileSheetOpen: true, form })),
  closePPPProfileFormSheet: () =>
    set((state) => ({ ...state, pppProfileSheetOpen: false, form: null })),
  setSelectedPPPProfile: (profile: PPPProfileItem | null) =>
    set((state) => ({ ...state, selectedPPPProfile: profile })),
}));

export { usePPPProfileStore };
