import { create } from "zustand";
import { AccessScopeData, AccessScopeFormMode } from "../types/access-scope";

interface AccessScopeState {
  form: AccessScopeFormMode;
  sheetOpen: boolean;
  selectedScope: AccessScopeData | null;
  openSheet: (form: AccessScopeFormMode, scope?: AccessScopeData) => void;
  closeSheet: () => void;
}

const useAccessScopeStore = create<AccessScopeState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedScope: null,
  openSheet: (form, scope) =>
    set({ sheetOpen: true, form, selectedScope: scope ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedScope: null }),
}));

export { useAccessScopeStore };
