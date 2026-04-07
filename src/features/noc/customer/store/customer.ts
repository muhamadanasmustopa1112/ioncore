import { create } from "zustand";

interface CustomerState {
  form: "new" | "edit" | "details" | null;
  customerSheetOpen: boolean;
  openCustomerFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeCustomerFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setCustomerFormSheetOpen: (open: boolean) => void;
}

const useCustomerStore = create<CustomerState>((set) => ({
  form: "new",
  customerSheetOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setCustomerFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, customerSheetOpen: open })),
  openCustomerFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, customerSheetOpen: true, form })),
  closeCustomerFormSheet: () =>
    set((state) => ({ ...state, customerSheetOpen: false, form: null })),
}));

export { useCustomerStore };
