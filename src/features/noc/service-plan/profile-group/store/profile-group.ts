import { create } from "zustand";
import { ProfileGroupData } from "../types";

interface ProfileGroupState {
  form: "new" | "edit" | "details" | null;
  profileGroupSheetOpen: boolean;
  selectedProfileGroup: ProfileGroupData | null;
  openProfileGroupFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeProfileGroupFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setProfileGroupFormSheetOpen: (open: boolean) => void;
  setSelectedProfileGroup: (profileGroup: ProfileGroupData | null) => void;
}

const useProfileGroupStore = create<ProfileGroupState>((set) => ({
  form: "new",
  profileGroupSheetOpen: false,
  selectedProfileGroup: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setProfileGroupFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, profileGroupSheetOpen: open })),
  openProfileGroupFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, profileGroupSheetOpen: true, form })),
  closeProfileGroupFormSheet: () =>
    set((state) => ({ ...state, profileGroupSheetOpen: false, form: null })),
  setSelectedProfileGroup: (profileGroup: ProfileGroupData | null) =>
    set((state) => ({ ...state, selectedProfileGroup: profileGroup })),
}));

export { useProfileGroupStore };
