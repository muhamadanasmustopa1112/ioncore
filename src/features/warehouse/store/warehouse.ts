import { create } from "zustand";
import { LowStockAlertData, WorkOrder, HandoverRecord } from "../types";

// Pre-configured list of low stock alerts with category and uom
const INITIAL_ASSETS: LowStockAlertData[] = [
  {
    id: "1",
    name: "Huawei HG8145V5 ONT",
    sku: "HW-ONT-992",
    units: 42,
    threshold: 100,
    status: "Critical",
    category: "Equipment",
    brand: "Huawei",
    model: "HG8145V5",
    uom: "pieces",
  },
  {
    id: "2",
    name: "Fiber Drop Cable (1km)",
    sku: "FIB-DRP-02",
    units: 12,
    threshold: 15,
    status: "Warning",
    category: "Cables",
    brand: "FiberOptic",
    model: "1KM-Drop",
    uom: "meters",
  },
  {
    id: "3",
    name: "Splitter 1:8 PLC Box",
    sku: "SPL-18-PLC",
    units: 85,
    threshold: 120,
    status: "Warning",
    category: "Connectors",
    brand: "Generic",
    model: "1:8 PLC Splitter",
    uom: "pieces",
  },
];

// Seed Work Orders for Handover, matching the user's specific HTML table values
const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: "WO-2024-M008",
    technicianName: "Budi Santoso",
    technicianRole: "Senior Engineer",
    avatarUrl: "",
    equipmentList: [
      { name: "Huawei HG8145V5 ONT", sku: "HW-ONT-992", qty: 2, uom: "pieces", serial: "SN-HUA99210" },
      { name: "Fiber Drop Cable (100m)", sku: "FIB-DRP-100M", qty: 1, uom: "meters" },
      { name: "Splitter 1:8 PLC Box", sku: "SPL-18-PLC", qty: 1, uom: "pieces" },
    ],
    status: "Pending",
    dateCreated: "May 05, 2026",
  },
  {
    id: "WO-2024-I102",
    technicianName: "Agus Prasetyo",
    technicianRole: "Junior Engineer",
    avatarUrl: "",
    equipmentList: [
      { name: "Fiber Drop Cable (200m)", sku: "FIB-DRP-200M", qty: 1, uom: "meters" },
      { name: "Splitter 1:4 PLC", sku: "SPL-14-PLC", qty: 2, uom: "pieces" },
    ],
    status: "Completed",
    dateCreated: "May 04, 2026",
  },
  {
    id: "WO-2024-M015",
    technicianName: "Sarah Lee",
    technicianRole: "Field Engineer",
    avatarUrl: "",
    equipmentList: [
      { name: "ZTE F609 GPON ONT", sku: "ZTE-ONT-404", qty: 1, uom: "pieces", serial: "SN-ZTE40498" },
      { name: "Fiber Drop Cable (150m)", sku: "FIB-DRP-150M", qty: 1, uom: "meters" },
    ],
    status: "Pending",
    dateCreated: "May 05, 2026",
  },
  {
    id: "WO-2024-I098",
    technicianName: "John Doe",
    technicianRole: "Senior Tech",
    avatarUrl: "",
    equipmentList: [
      { name: "Huawei HG8145V5 ONT", sku: "HW-ONT-992", qty: 4, uom: "pieces", serial: "SN-HUA88910" },
      { name: "Fiber Drop Cable (500m)", sku: "FIB-DRP-500M", qty: 1, uom: "meters" },
    ],
    status: "Completed",
    dateCreated: "May 03, 2026",
  },
  {
    id: "WO-2024-M022",
    technicianName: "Michael Chen",
    technicianRole: "Maintenance",
    avatarUrl: "",
    equipmentList: [
      { name: "Splitter 1:8 PLC Box", sku: "SPL-18-PLC", qty: 3, uom: "pieces" },
      { name: "SC/UPC Fiber Connectors", sku: "CON-SCUPC-10", qty: 20, uom: "pieces" },
    ],
    status: "Pending",
    dateCreated: "May 06, 2026",
  },
];

interface WarehouseState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  branchFilter: string;
  setBranchFilter: (branch: string) => void;

  // Asset Registration States
  assets: LowStockAlertData[];
  addAsset: (asset: Omit<LowStockAlertData, "id" | "status">) => void;
  assetSheetOpen: boolean;
  setAssetSheetOpen: (open: boolean) => void;

  // Handover States
  workOrders: WorkOrder[];
  completeWorkOrder: (id: string, serialNumber?: string) => void;
  handoverDialogOpen: boolean;
  setHandoverDialogOpen: (open: boolean) => void;
  handoverRecords: HandoverRecord[];
  addHandoverRecord: (record: Omit<HandoverRecord, "id" | "timestamp">) => void;

  // Details Panel State
  selectedWorkOrderId: string | null;
  setSelectedWorkOrderId: (id: string | null) => void;
}

export const useWarehouseStore = create<WarehouseState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  branchFilter: "All",
  setBranchFilter: (branch) => set({ branchFilter: branch }),

  // Asset Registration
  assets: INITIAL_ASSETS,
  addAsset: (newAsset) =>
    set((state) => {
      const id = String(state.assets.length + 1);
      const status = newAsset.units <= newAsset.threshold * 0.5 ? "Critical" : "Warning";
      const asset: LowStockAlertData = {
        ...newAsset,
        id,
        status,
      };
      return { assets: [asset, ...state.assets] };
    }),
  assetSheetOpen: false,
  setAssetSheetOpen: (open) => set({ assetSheetOpen: open }),

  // Handover
  workOrders: INITIAL_WORK_ORDERS,
  completeWorkOrder: (id, serialNumber) =>
    set((state) => ({
      workOrders: state.workOrders.map((wo) => {
        if (wo.id === id) {
          const updatedEquipment = wo.equipmentList.map((eq) =>
            eq.sku === "HW-ONT-992" || eq.sku === "ZTE-ONT-404"
              ? { ...eq, serial: serialNumber || eq.serial }
              : eq
          );
          return { ...wo, status: "Completed", equipmentList: updatedEquipment };
        }
        return wo;
      }),
    })),
  handoverDialogOpen: false,
  setHandoverDialogOpen: (open) => set({ handoverDialogOpen: open }),
  handoverRecords: [],
  addHandoverRecord: (record) =>
    set((state) => {
      const newRecord: HandoverRecord = {
        ...record,
        id: `HND-${state.handoverRecords.length + 100}`,
        timestamp: new Date().toLocaleString(),
      };
      return { handoverRecords: [newRecord, ...state.handoverRecords] };
    }),

  // Selection
  selectedWorkOrderId: null,
  setSelectedWorkOrderId: (id) => set({ selectedWorkOrderId: id }),
}));
