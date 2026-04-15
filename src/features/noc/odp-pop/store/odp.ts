import { create } from "zustand";

interface OdpStore {
  isAddOdpDialogOpen: boolean;
  openAddOdpDialog: () => void;
  closeAddOdpDialog: () => void;
  setAddOdpDialogOpen: (open: boolean) => void;
}

export const useOdpStore = create<OdpStore>((set) => ({
  isAddOdpDialogOpen: false,
  openAddOdpDialog: () => set({ isAddOdpDialogOpen: true }),
  closeAddOdpDialog: () => set({ isAddOdpDialogOpen: false }),
  setAddOdpDialogOpen: (open) => set({ isAddOdpDialogOpen: open }),
}));
