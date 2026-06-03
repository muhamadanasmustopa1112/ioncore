import { create } from "zustand";
import { SuspensionItem } from "../types";

interface SuspensionState {
  selectedSuspension: SuspensionItem | null;
  setSelectedSuspension: (suspension: SuspensionItem | null) => void;
  formMode: "details" | "approve" | "restore" | null;
  suspensionSheetOpen: boolean;
  openSuspensionSheet: (mode: "details" | "approve" | "restore") => void;
  closeSuspensionSheet: () => void;
}

const useSuspensionStore = create<SuspensionState>((set) => ({
  selectedSuspension: null,
  setSelectedSuspension: (suspension) =>
    set((state) => ({ ...state, selectedSuspension: suspension })),
  formMode: null,
  suspensionSheetOpen: false,
  openSuspensionSheet: (mode) =>
    set((state) => ({ ...state, suspensionSheetOpen: true, formMode: mode })),
  closeSuspensionSheet: () =>
    set((state) => ({ ...state, suspensionSheetOpen: false, formMode: null })),
}));

export { useSuspensionStore };
