import { create } from "zustand";

interface OltStore {
  isAddOltDialogOpen: boolean;
  openAddOltDialog: () => void;
  closeAddOltDialog: () => void;
  setAddOltDialogOpen: (open: boolean) => void;
}

export const useOltStore = create<OltStore>((set) => ({
  isAddOltDialogOpen: false,
  openAddOltDialog: () => set({ isAddOltDialogOpen: true }),
  closeAddOltDialog: () => set({ isAddOltDialogOpen: false }),
  setAddOltDialogOpen: (open) => set({ isAddOltDialogOpen: open }),
}));
