import { create } from "zustand";
import type { NetworkNodeType, MasterDataFormMode } from "../types/master-data";

interface MasterDataState {
  sheetOpen: boolean;
  form: MasterDataFormMode;
  selectedNodeType: NetworkNodeType | null;
  openSheet: (form: MasterDataFormMode, nodeType?: NetworkNodeType) => void;
  closeSheet: () => void;
}

export const useMasterDataStore = create<MasterDataState>((set) => ({
  sheetOpen: false,
  form: "new",
  selectedNodeType: null,
  openSheet: (form, nodeType) =>
    set({ sheetOpen: true, form, selectedNodeType: nodeType ?? null }),
  closeSheet: () => set({ sheetOpen: false, form: null, selectedNodeType: null }),
}));
