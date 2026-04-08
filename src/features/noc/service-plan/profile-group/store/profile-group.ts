import { create } from "zustand";

interface ProfileGroupState {
  form: "new" | "edit" | "details" | null;
  profileGroupSheetOpen: boolean;
  openProfileGroupFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeProfileGroupFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setProfileGroupFormSheetOpen: (open: boolean) => void;
}

const useProfileGroupStore = create<ProfileGroupState>((set) => ({
  form: "new",
  profileGroupSheetOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setProfileGroupFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, profileGroupSheetOpen: open })),
  openProfileGroupFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, profileGroupSheetOpen: true, form })),
  closeProfileGroupFormSheet: () =>
    set((state) => ({ ...state, profileGroupSheetOpen: false, form: null })),
}));

export { useProfileGroupStore };
