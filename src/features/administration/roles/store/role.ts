import { create } from "zustand";
import { RoleData, RoleFormMode } from "../types";

interface RoleState {
  form: RoleFormMode;
  roleDialogOpen: boolean;
  selectedRole: RoleData | null;
  openRoleDialog: (form: RoleFormMode, role?: RoleData) => void;
  closeRoleDialog: () => void;
  setForm: (form: RoleFormMode) => void;
  setRoleDialogOpen: (open: boolean) => void;
}

const useRoleStore = create<RoleState>((set) => ({
  form: "new",
  roleDialogOpen: false,
  selectedRole: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setRoleDialogOpen: (open) => set((state) => ({ ...state, roleDialogOpen: open })),
  openRoleDialog: (form, role) =>
    set((state) => ({ ...state, roleDialogOpen: true, form, selectedRole: role ?? null })),
  closeRoleDialog: () =>
    set((state) => ({ ...state, roleDialogOpen: false, form: null, selectedRole: null })),
}));

export { useRoleStore };
