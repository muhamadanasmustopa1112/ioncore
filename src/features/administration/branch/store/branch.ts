import { create } from "zustand";
import { BranchFormMode } from "../types";

interface BranchState {
  form: BranchFormMode;
  branchSheetOpen: boolean;
  openBranchFormSheet: (form: BranchFormMode) => void;
  closeBranchFormSheet: () => void;
  setForm: (form: BranchFormMode) => void;
  setBranchFormSheetOpen: (open: boolean) => void;
}

const useBranchStore = create<BranchState>((set) => ({
  form: "new",
  branchSheetOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setBranchFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, branchSheetOpen: open })),
  openBranchFormSheet: (form: BranchFormMode) =>
    set((state) => ({ ...state, branchSheetOpen: true, form })),
  closeBranchFormSheet: () =>
    set((state) => ({ ...state, branchSheetOpen: false, form: null })),
}));

export { useBranchStore };
