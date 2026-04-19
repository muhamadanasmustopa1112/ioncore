import { create } from "zustand";
import type { WorkOrder } from "../types/work-order";

type SheetMode = "create" | "edit" | "detail" | null;

interface WorkOrderState {
  sheetOpen: boolean;
  sheetMode: SheetMode;
  selectedWorkOrder: WorkOrder | null;
  openSheet: (mode: SheetMode, workOrder?: WorkOrder) => void;
  closeSheet: () => void;
}

export const useWorkOrderStore = create<WorkOrderState>((set) => ({
  sheetOpen: false,
  sheetMode: null,
  selectedWorkOrder: null,
  openSheet: (mode, workOrder) =>
    set({ sheetOpen: true, sheetMode: mode, selectedWorkOrder: workOrder ?? null }),
  closeSheet: () =>
    set({ sheetOpen: false, sheetMode: null, selectedWorkOrder: null }),
}));
