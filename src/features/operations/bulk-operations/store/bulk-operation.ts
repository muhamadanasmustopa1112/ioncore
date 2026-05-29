import { create } from "zustand";
import { BulkOperation } from "../types";

interface BulkOperationState {
  wizardOpen: boolean;
  wizardStep: number;
  selectedOperation: BulkOperation | null;
  openWizard: () => void;
  closeWizard: () => void;
  setWizardStep: (step: number) => void;
  setSelectedOperation: (operation: BulkOperation | null) => void;
}

export const useBulkOperationStore = create<BulkOperationState>((set) => ({
  wizardOpen: false,
  wizardStep: 1,
  selectedOperation: null,
  openWizard: () => set({ wizardOpen: true, wizardStep: 1 }),
  closeWizard: () =>
    set({ wizardOpen: false, wizardStep: 1, selectedOperation: null }),
  setWizardStep: (step) => set({ wizardStep: step }),
  setSelectedOperation: (operation) => set({ selectedOperation: operation }),
}));
