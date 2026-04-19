import { create } from "zustand";
import type { ChecklistBinding, BindingFormMode } from "../types/binding";

interface BindingState {
  sheetOpen: boolean;
  form: BindingFormMode;
  selectedBinding: ChecklistBinding | null;
  prefillWoType: string | null;
  prefillProductType: string | null;
  openSheet: (form: BindingFormMode, binding?: ChecklistBinding, prefill?: { woType?: string; productType?: string }) => void;
  closeSheet: () => void;
}

export const useBindingStore = create<BindingState>((set) => ({
  sheetOpen: false,
  form: "new",
  selectedBinding: null,
  prefillWoType: null,
  prefillProductType: null,
  openSheet: (form, binding, prefill) =>
    set({
      sheetOpen: true,
      form,
      selectedBinding: binding ?? null,
      prefillWoType: prefill?.woType ?? null,
      prefillProductType: prefill?.productType ?? null,
    }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedBinding: null, prefillWoType: null, prefillProductType: null }),
}));
