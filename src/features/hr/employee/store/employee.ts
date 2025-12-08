import { create } from "zustand";
import { Employee } from "../types";

interface EmployeeState {
  form: "new" | "edit" | "details" | null;
  employeeSheetOpen: boolean;
  employeeDetailsSheetOpen: boolean;
  selectedEmployee: Employee | null;
  openEmployeeFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeEmployeeFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setEmployeeFormSheetOpen: (open: boolean) => void;
  openEmployeeDetailsSheet: (employee: Employee) => void;
  closeEmployeeDetailsSheet: () => void;
  setEmployeeDetailsSheetOpen: (open: boolean) => void;
}

const useEmployeeStore = create<EmployeeState>((set) => ({
  form: "new",
  employeeSheetOpen: false,
  employeeDetailsSheetOpen: false,
  selectedEmployee: null,
  setForm: () => set((state) => ({ ...state, form: "new" })),
  setEmployeeFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, employeeSheetOpen: open })),
  openEmployeeFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, employeeSheetOpen: true, form })),
  closeEmployeeFormSheet: () =>
    set((state) => ({ ...state, employeeSheetOpen: false, form: null })),
  openEmployeeDetailsSheet: (employee: Employee) =>
    set((state) => ({
      ...state,
      employeeDetailsSheetOpen: true,
      selectedEmployee: employee,
    })),
  closeEmployeeDetailsSheet: () =>
    set((state) => ({
      ...state,
      employeeDetailsSheetOpen: false,
      selectedEmployee: null,
    })),
  setEmployeeDetailsSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, employeeDetailsSheetOpen: open })),
}));

export { useEmployeeStore };
