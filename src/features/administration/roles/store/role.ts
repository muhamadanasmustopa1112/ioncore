import { create } from "zustand";
import { RoleFormMode } from "../types";

interface RoleState {
  form: RoleFormMode;
  roleDialogOpen: boolean;
  openRoleDialog: (form: RoleFormMode) => void;
  closeRoleDialog: () => void;
  setForm: (form: RoleFormMode) => void;
  setRoleDialogOpen: (open: boolean) => void;
}

const useRoleStore = create<RoleState>((set) => ({
  form: "new",
  roleDialogOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setRoleDialogOpen: (open) => set((state) => ({ ...state, roleDialogOpen: open })),
  openRoleDialog: (form) => set((state) => ({ ...state, roleDialogOpen: true, form })),
  closeRoleDialog: () => set((state) => ({ ...state, roleDialogOpen: false, form: null })),
}));

export { useRoleStore };
