import { create } from "zustand";
import { CoverageData, CoverageFormMode } from "../types/coverage";

interface CoverageState {
  form: CoverageFormMode;
  sheetOpen: boolean;
  selectedBranchId: string;
  selectedCoverage: CoverageData | null;
  openSheet: (form: CoverageFormMode, coverage?: CoverageData) => void;
  closeSheet: () => void;
  setSelectedBranchId: (id: string) => void;
}

const useCoverageStore = create<CoverageState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedBranchId: "",
  selectedCoverage: null,
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  openSheet: (form, coverage) =>
    set({ sheetOpen: true, form, selectedCoverage: coverage ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedCoverage: null }),
}));

export { useCoverageStore };
