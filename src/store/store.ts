import { create } from "zustand";
import { MenuItem } from "@/config/types";

interface StoreState {
  layout: "horizontal" | "vertical";
  setLayout: (layout: "horizontal" | "vertical") => void;
  menu: MenuItem;
  setMenu: (menu: MenuItem) => void;
}

const useStore = create<StoreState>((set) => ({
  layout: "vertical",
  setLayout: (layout: "horizontal" | "vertical") => set({ layout }),
  menu: {
    title: "Dashboard",
  },
  setMenu: (menu: MenuItem) => set({ menu }),
}));

export { useStore };
