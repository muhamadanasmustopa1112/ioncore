import { create } from "zustand";
import type { Override } from "../types/overrides";

interface OverridesState {
  sheetOpen: boolean;
  selectedOverride: Override | null;
  openSheet: (override?: Override) => void;
  closeSheet: () => void;
}

export const useOverridesStore = create<OverridesState>((set) => ({
  sheetOpen: false,
  selectedOverride: null,
  openSheet: (override) => set({ sheetOpen: true, selectedOverride: override ?? null }),
  closeSheet: () => set({ sheetOpen: false, selectedOverride: null }),
}));
