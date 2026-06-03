import { create } from "zustand";
import type { Settlement } from "../types/settlement";

interface SettlementState {
  selectedItem: Settlement | null;
  setSelectedItem: (item: Settlement | null) => void;
}

export const useSettlementStore = create<SettlementState>((set) => ({
  selectedItem: null,
  setSelectedItem: (selectedItem) => set({ selectedItem }),
}));
