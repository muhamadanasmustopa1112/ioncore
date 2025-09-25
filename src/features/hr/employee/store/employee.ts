import { create } from "zustand";

interface EmployeeState {
  form: "new" | "edit" | null;
  employeeSheetOpen: boolean;
  openEmployeeFormSheet: (form: "new" | "edit" | null) => void;
  closeEmployeeFormSheet: () => void;
  setForm: (form: "new" | "edit" | null) => void;
  setEmployeeFormSheetOpen: (open: boolean) => void;
}

const useEmployeeStore = create<EmployeeState>((set) => ({
  form: "new",
  employeeSheetOpen: false,
  setForm: () => set((state) => ({ ...state, form: "new" })),
  setEmployeeFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, employeeSheetOpen: open })),
  openEmployeeFormSheet: (form: "new" | "edit" | null) =>
    set((state) => ({ ...state, employeeSheetOpen: true, form })),
  closeEmployeeFormSheet: () =>
    set((state) => ({ ...state, employeeSheetOpen: false, form: null })),
}));

export { useEmployeeStore };
