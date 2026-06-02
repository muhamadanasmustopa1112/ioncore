import { create } from "zustand";
import type { Project } from "../types/project";

interface ProjectState {
  form: "new" | "edit" | "details";
  sheetOpen: boolean;
  selectedItem: Project | null;
  openFormSheet: (form: "new" | "edit" | "details") => void;
  closeFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details") => void;
  setSheetOpen: (open: boolean) => void;
  setSelectedItem: (item: Project | null) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  form: "new",
  sheetOpen: false,
  selectedItem: null,
  openFormSheet: (form) => set((state) => ({ ...state, sheetOpen: true, form })),
  closeFormSheet: () => set((state) => ({ ...state, sheetOpen: false, form: "new", selectedItem: null })),
  setForm: (form) => set((state) => ({ ...state, form })),
  setSheetOpen: (sheetOpen) => set((state) => ({ ...state, sheetOpen })),
  setSelectedItem: (selectedItem) => set((state) => ({ ...state, selectedItem })),
}));
