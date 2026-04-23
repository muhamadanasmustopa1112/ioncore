import { create } from "zustand";
import { PopData } from "../types/pop";

interface PopState {
    form: "new" | "edit" | "details" | null;
    popSheetOpen: boolean;
    selectedPop: PopData | null;
    openPopFormSheet: (form: "new" | "edit" | "details" | null) => void;
    closePopFormSheet: () => void;
    setForm: (form: "new" | "edit" | "details" | null) => void;
    setPopFormSheetOpen: (open: boolean) => void;
    setSelectedPop: (pop: PopData | null) => void;
}

const usePopStore = create<PopState>((set) => ({
    form: "new",
    popSheetOpen: false,
    selectedPop: null,
    setForm: (form) => set((state) => ({ ...state, form })),
    setPopFormSheetOpen: (open: boolean) =>
        set((state) => ({ ...state, popSheetOpen: open })),
    openPopFormSheet: (form: "new" | "edit" | "details" | null) =>
        set((state) => ({ ...state, popSheetOpen: true, form })),
    closePopFormSheet: () =>
        set((state) => ({ ...state, popSheetOpen: false, form: null, selectedPop: null })),
    setSelectedPop: (pop) => set((state) => ({ ...state, selectedPop: pop })),
}));

export { usePopStore };