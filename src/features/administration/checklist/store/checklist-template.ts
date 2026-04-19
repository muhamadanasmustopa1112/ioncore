import { create } from "zustand";
import type { ChecklistTemplate, TemplateFormMode } from "../types/checklist-template";

interface ChecklistTemplateState {
  sheetOpen: boolean;
  form: TemplateFormMode;
  selectedTemplate: ChecklistTemplate | null;
  openSheet: (form: TemplateFormMode, template?: ChecklistTemplate) => void;
  closeSheet: () => void;
}

export const useChecklistTemplateStore = create<ChecklistTemplateState>((set) => ({
  sheetOpen: false,
  form: "new",
  selectedTemplate: null,
  openSheet: (form, template) =>
    set({ sheetOpen: true, form, selectedTemplate: template ?? null }),
  closeSheet: () => set({ sheetOpen: false, form: null, selectedTemplate: null }),
}));
