import { create } from "zustand";
import { ResourceMappingData, ResourceMappingFormMode } from "../types/resource-mapping";

interface ResourceMappingState {
  form: ResourceMappingFormMode;
  sheetOpen: boolean;
  selectedMapping: ResourceMappingData | null;
  openSheet: (form: ResourceMappingFormMode, mapping?: ResourceMappingData) => void;
  closeSheet: () => void;
}

const useResourceMappingStore = create<ResourceMappingState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedMapping: null,
  openSheet: (form, mapping) =>
    set({ sheetOpen: true, form, selectedMapping: mapping ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, form: null, selectedMapping: null }),
}));

export { useResourceMappingStore };
