import { create } from "zustand";
import type { WizardState } from "../types";

export const useBulkOperationWizardStore = create<WizardState>((set) => ({
  currentStep: 0,
  sourcePlan: null,
  targetPlan: null,
  scopeType: "all",
  selectedAreas: [],
  selectedCustomerType: null,
  selectedCustomerIds: [],
  isExecuting: false,
  executionProgress: 0,
  executionResults: [],

  reset: () =>
    set({
      currentStep: 0,
      sourcePlan: null,
      targetPlan: null,
      scopeType: "all",
      selectedAreas: [],
      selectedCustomerType: null,
      selectedCustomerIds: [],
      isExecuting: false,
      executionProgress: 0,
      executionResults: [],
    }),

  setStep: (step) => set({ currentStep: step }),
  setSourcePlan: (plan) => set({ sourcePlan: plan }),
  setTargetPlan: (plan) => set({ targetPlan: plan }),
  setScopeType: (type) => set({ scopeType: type }),
  setSelectedAreas: (areas) => set({ selectedAreas: areas }),
  setSelectedCustomerType: (type) => set({ selectedCustomerType: type }),
  setSelectedCustomerIds: (ids) => set({ selectedCustomerIds: ids }),
  setExecuting: (executing) => set({ isExecuting: executing }),
  setExecutionProgress: (progress) => set({ executionProgress: progress }),
  setExecutionResults: (results) => set({ executionResults: results }),
}));
