import { create } from "zustand";
import { UserData, UserFormMode } from "../types";

interface UserState {
  form: UserFormMode;
  userSheetOpen: boolean;
  selectedUser: UserData | null;
  openUserFormSheet: (form: UserFormMode, user?: UserData) => void;
  closeUserFormSheet: () => void;
  setForm: (form: UserFormMode) => void;
  setUserFormSheetOpen: (open: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
  form: "new",
  userSheetOpen: false,
  selectedUser: null,
  setForm: (form) => set((s) => ({ ...s, form })),
  setUserFormSheetOpen: (open) => set((s) => ({ ...s, userSheetOpen: open })),
  openUserFormSheet: (form, user) =>
    set((s) => ({ ...s, userSheetOpen: true, form, selectedUser: user ?? null })),
  closeUserFormSheet: () =>
    set((s) => ({ ...s, userSheetOpen: false, form: null, selectedUser: null })),
}));

export { useUserStore };
