import { create } from "zustand";
import { UserData, UserFormMode } from "../types";

interface UserState {
  form: UserFormMode;
  userSheetOpen: boolean;
  selectedUser: UserData | null;
  passwordSheetOpen: boolean;
  passwordSheetUser: UserData | null;
  openUserFormSheet: (form: UserFormMode, user?: UserData) => void;
  closeUserFormSheet: () => void;
  openChangePasswordSheet: (user: UserData) => void;
  closeChangePasswordSheet: () => void;
  setForm: (form: UserFormMode) => void;
  setUserFormSheetOpen: (open: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
  form: "new",
  userSheetOpen: false,
  selectedUser: null,
  passwordSheetOpen: false,
  passwordSheetUser: null,
  setForm: (form) => set((s) => ({ ...s, form })),
  setUserFormSheetOpen: (open) => set((s) => ({ ...s, userSheetOpen: open })),
  openUserFormSheet: (form, user) =>
    set((s) => ({ ...s, userSheetOpen: true, form, selectedUser: user ?? null })),
  closeUserFormSheet: () =>
    set((s) => ({ ...s, userSheetOpen: false, form: null, selectedUser: null })),
  openChangePasswordSheet: (user) =>
    set((s) => ({ ...s, passwordSheetOpen: true, passwordSheetUser: user })),
  closeChangePasswordSheet: () =>
    set((s) => ({ ...s, passwordSheetOpen: false, passwordSheetUser: null })),
}));

export { useUserStore };
