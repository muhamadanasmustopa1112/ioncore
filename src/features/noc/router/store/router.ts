import { create } from "zustand";
import { RouterItem } from "../types";

interface RouterState {
  form: "new" | "edit" | "details" | null;
  routerSheetOpen: boolean;
  selectedRouter: RouterItem | null;
  openRouterFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeRouterFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setRouterFormSheetOpen: (open: boolean) => void;
  setSelectedRouter: (router: RouterItem | null) => void;
}

const useRouterStore = create<RouterState>((set) => ({
  form: "new",
  routerSheetOpen: false,
  selectedRouter: null,
  setForm: (form) => set((state) => ({ ...state, form })),
  setRouterFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, routerSheetOpen: open })),
  openRouterFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, routerSheetOpen: true, form })),
  closeRouterFormSheet: () =>
    set((state) => ({ ...state, routerSheetOpen: false, form: null })),
  setSelectedRouter: (router: RouterItem | null) =>
    set((state) => ({ ...state, selectedRouter: router })),
}));

export { useRouterStore };
