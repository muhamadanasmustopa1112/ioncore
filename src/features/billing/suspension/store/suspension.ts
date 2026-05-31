import { create } from "zustand";
import { SuspensionItem } from "../types";

interface SuspensionState {
  selectedSuspension: SuspensionItem | null;
  setSelectedSuspension: (suspension: SuspensionItem | null) => void;
}

const useSuspensionStore = create<SuspensionState>((set) => ({
  selectedSuspension: null,
  setSelectedSuspension: (suspension) =>
    set((state) => ({ ...state, selectedSuspension: suspension })),
}));

export { useSuspensionStore };
