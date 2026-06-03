import { create } from "zustand";
import type { PreBoq, Rfq, Boq, Quotation } from "../types/cpq";

export type CpqEntity = "preBoq" | "rfq" | "boq" | "quotation";
export type CpqFormMode = "new" | "edit" | "details";

interface EntityState {
  form: CpqFormMode;
  sheetOpen: boolean;
  selectedItem: PreBoq | Rfq | Boq | Quotation | null;
}

interface CpqState {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  preBoq: EntityState;
  rfq: EntityState;
  boq: EntityState;
  quotation: EntityState;

  openFormSheet: (entity: CpqEntity, mode: CpqFormMode) => void;
  closeFormSheet: (entity: CpqEntity) => void;
  setSelectedItem: (entity: CpqEntity, item: PreBoq | Rfq | Boq | Quotation | null) => void;
}

const initialEntityState: EntityState = {
  form: "new",
  sheetOpen: false,
  selectedItem: null,
};

export const useCpqStore = create<CpqState>((set) => ({
  activeTab: "pre-boq",
  setActiveTab: (activeTab) => set((state) => ({ ...state, activeTab })),

  preBoq: { ...initialEntityState },
  rfq: { ...initialEntityState },
  boq: { ...initialEntityState },
  quotation: { ...initialEntityState },

  openFormSheet: (entity, mode) =>
    set((state) => ({
      ...state,
      [entity]: { ...state[entity], sheetOpen: true, form: mode },
    })),

  closeFormSheet: (entity) =>
    set((state) => ({
      ...state,
      [entity]: { ...initialEntityState },
    })),

  setSelectedItem: (entity, item) =>
    set((state) => ({
      ...state,
      [entity]: { ...state[entity], selectedItem: item },
    })),
}));
