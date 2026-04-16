import { create } from "zustand";
import { CrossBranchRuleData, CrossBranchRuleFormMode } from "../types/cross-branch-rules";

interface CrossBranchRulesState {
  form: CrossBranchRuleFormMode;
  sheetOpen: boolean;
  selectedRule: CrossBranchRuleData | null;
  openSheet: (form: CrossBranchRuleFormMode, rule?: CrossBranchRuleData) => void;
  closeSheet: () => void;
}

const useCrossBranchRulesStore = create<CrossBranchRulesState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedRule: null,
  openSheet: (form, rule) =>
    set({ sheetOpen: true, form, selectedRule: rule ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedRule: null }),
}));

export { useCrossBranchRulesStore };
