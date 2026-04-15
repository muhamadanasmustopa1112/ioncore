import { create } from "zustand";

interface ProvisioningStore {
  isProvisioningSheetOpen: boolean;
  openProvisioningSheet: () => void;
  closeProvisioningSheet: () => void;
  setProvisioningSheetOpen: (open: boolean) => void;
}

export const useProvisioningStore = create<ProvisioningStore>((set) => ({
  isProvisioningSheetOpen: false,
  openProvisioningSheet: () => set({ isProvisioningSheetOpen: true }),
  closeProvisioningSheet: () => set({ isProvisioningSheetOpen: false }),
  setProvisioningSheetOpen: (open) => set({ isProvisioningSheetOpen: open }),
}));
