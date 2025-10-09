import { create } from "zustand";

interface EmployeeState {
  form: "new" | "edit" | "details" | null;
  employeeSheetOpen: boolean;
  openEmployeeFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeEmployeeFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setEmployeeFormSheetOpen: (open: boolean) => void;
}

const useEmployeeStore = create<EmployeeState>((set) => ({
  form: "new",
  employeeSheetOpen: false,
  setForm: () => set((state) => ({ ...state, form: "new" })),
  setEmployeeFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, employeeSheetOpen: open })),
  openEmployeeFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, employeeSheetOpen: true, form })),
  closeEmployeeFormSheet: () =>
    set((state) => ({ ...state, employeeSheetOpen: false, form: null })),
}));

export { useEmployeeStore };
