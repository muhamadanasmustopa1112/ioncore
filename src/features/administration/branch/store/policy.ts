import { create } from "zustand";
import { PolicyData, PolicyFormMode } from "../types/policy";

interface PolicyState {
  form: PolicyFormMode;
  sheetOpen: boolean;
  selectedBranchId: string;
  selectedPolicy: PolicyData | null;
  openSheet: (form: PolicyFormMode, policy?: PolicyData) => void;
  closeSheet: () => void;
  setSelectedBranchId: (id: string) => void;
}

const usePolicyStore = create<PolicyState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedBranchId: "",
  selectedPolicy: null,
  setSelectedBranchId: (id) => set({ selectedBranchId: id }),
  openSheet: (form, policy) =>
    set({ sheetOpen: true, form, selectedPolicy: policy ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedPolicy: null }),
}));

export { usePolicyStore };
