import { create } from "zustand";

interface StoreState {
  layout: "horizontal" | "vertical";
  setLayout: (layout: "horizontal" | "vertical") => void;
}

const useStore = create<StoreState>((set) => ({
  layout: "vertical",
  setLayout: (layout: "horizontal" | "vertical") => set({ layout }),
}));

export { useStore };
