import { create } from "zustand";

interface RouterState {
  form: "new" | "edit" | "details" | null;
  routerSheetOpen: boolean;
  openRouterFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeRouterFormSheet: () => void;
  setForm: (form: "new" | "edit" | "details" | null) => void;
  setRouterFormSheetOpen: (open: boolean) => void;
}

const useRouterStore = create<RouterState>((set) => ({
  form: "new",
  routerSheetOpen: false,
  setForm: (form) => set((state) => ({ ...state, form })),
  setRouterFormSheetOpen: (open: boolean) =>
    set((state) => ({ ...state, routerSheetOpen: open })),
  openRouterFormSheet: (form: "new" | "edit" | "details" | null) =>
    set((state) => ({ ...state, routerSheetOpen: true, form })),
  closeRouterFormSheet: () =>
    set((state) => ({ ...state, routerSheetOpen: false, form: null })),
}));

export { useRouterStore };
