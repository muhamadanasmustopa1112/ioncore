import { create } from "zustand";
import { BranchData, BranchFormMode } from "../types";

interface BranchState {
  form: BranchFormMode;
  branchSheetOpen: boolean;
  selectedBranch: BranchData | null;
  openBranchFormSheet: (form: BranchFormMode, branch?: BranchData) => void;
  closeBranchFormSheet: () => void;
  setForm: (form: BranchFormMode) => void;
  setBranchFormSheetOpen: (open: boolean) => void;
}

const useBranchStore = create<BranchState>((set) => ({
  form: "new",
  branchSheetOpen: false,
  selectedBranch: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setBranchFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, branchSheetOpen: open })),
  openBranchFormSheet: (form: BranchFormMode, branch?: BranchData) =>
    set((state) => ({
      ...state,
      branchSheetOpen: true,
      form,
      selectedBranch: branch ?? null,
    })),
  closeBranchFormSheet: () =>
    set((state) => ({
      ...state,
      branchSheetOpen: false,
      form: null,
      selectedBranch: null,
    })),
}));

export { useBranchStore };
