import { create } from "zustand";
import { CommissionItem } from "../types";

interface CommissionState {
  selectedCommission: CommissionItem | null;
  sheetOpen: boolean;
  openDetailSheet: (item: CommissionItem) => void;
  closeDetailSheet: () => void;
}

const useCommissionStore = create<CommissionState>((set) => ({
  selectedCommission: null,
  sheetOpen: false,
  openDetailSheet: (item) =>
    set((state) => ({ ...state, selectedCommission: item, sheetOpen: true })),
  closeDetailSheet: () =>
    set((state) => ({ ...state, sheetOpen: false, selectedCommission: null })),
}));

export { useCommissionStore };
