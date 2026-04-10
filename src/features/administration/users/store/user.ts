import { create } from "zustand";
import { UserFormMode } from "../types";

interface UserState {
  form: UserFormMode;
  userSheetOpen: boolean;
  openUserFormSheet: (form: UserFormMode) => void;
  closeUserFormSheet: () => void;
  setForm: (form: UserFormMode) => void;
  setUserFormSheetOpen: (open: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
  form: "new",
  userSheetOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setUserFormSheetOpen: (open) => set((state) => ({ ...state, userSheetOpen: open })),
  openUserFormSheet: (form) => set((state) => ({ ...state, userSheetOpen: true, form })),
  closeUserFormSheet: () => set((state) => ({ ...state, userSheetOpen: false, form: null })),
}));

export { useUserStore };
