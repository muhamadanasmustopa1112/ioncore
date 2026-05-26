import { create } from "zustand";
import {
  LowStockAlertData,
  WorkOrder,
  HandoverRecord,
  WarehouseAsset,
  RetrofitJob,
} from "../types";

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
];

// Seed Serialized Assets matching PostgreSQL 'assets' table
const INITIAL_SERIALIZED_ASSETS: WarehouseAsset[] = [
  {
    id: "AST-001",
    stockItemId: "item-1",
    sku: "HW-ONT-992",
    name: "Huawei HG8145V5 ONT",
    category: "customer_equipment",
    serialNumber: "SN-HUA99210",
    qrCode: "ION-ASSET-000142",
    receivedAt: "2026-05-10T09:00:00Z",
    purchaseCost: 485000.00,
    warehouseId: "WH-BDG-UTR-01",
    warehouseName: "Gudang Bandung Utara",
    status: "in_warehouse",
    isRetrofit: false,
  },
  {
    id: "AST-002",
    stockItemId: "item-1",
    sku: "HW-ONT-992",
    name: "Huawei HG8145V5 ONT (Broken Board)",
    category: "customer_equipment",
    serialNumber: "SN-HUA88910",
    qrCode: "ION-ASSET-000143",
    receivedAt: "2026-05-08T11:30:00Z",
    purchaseCost: 485000.00,
    warehouseId: "WH-BDG-UTR-01",
    warehouseName: "Gudang Bandung Utara",
    status: "defective",
    isRetrofit: false,
  },
  {
    id: "AST-003",
    stockItemId: "item-3",
    sku: "ZTE-ONT-404",
    name: "ZTE F609 GPON ONT (Broken Chassis)",
    category: "customer_equipment",
    serialNumber: "SN-ZTE40498",
    qrCode: "ION-ASSET-000185",
    receivedAt: "2026-05-06T14:15:00Z",
    purchaseCost: 450000.00,
    warehouseId: "WH-BDG-UTR-01",
    warehouseName: "Gudang Bandung Utara",
    status: "defective",
    isRetrofit: false,
  },
  {
    id: "AST-004",
    stockItemId: "item-4",
    sku: "OTD-OTDR-EX",
    name: "EXFO AXS-110 OTDR",
    category: "field_tool",
    serialNumber: "EXFO-AXS110-SN00892",
    qrCode: "ION-ASSET-000912",
    receivedAt: "2025-01-15T08:00:00Z",
    purchaseCost: 12500000.00,
    warehouseId: "WH-BDG-UTR-01",
    warehouseName: "Gudang Bandung Utara",
    status: "assigned",
    isRetrofit: false,
    assignedTechnicianId: "TECH-001",
    assignedTechnicianName: "Budi Santoso",
  },
  {
    id: "AST-005",
    stockItemId: "item-5",
    sku: "ZTE-GTGO-CARD",
    name: "ZTE GTGO OLT Card",
    category: "infrastructure_equipment",
    serialNumber: "ZTE-GTGO-CARD-SN00123",
    qrCode: "ION-ASSET-000551",
    receivedAt: "2024-11-20T10:00:00Z",
    purchaseCost: 8750000.00,
    status: "installed",
    isRetrofit: false,
    branchId: "SA-BDG-UTR",
    branchName: "SA-BDG-UTR Branch",
  },
];

// Seed Retrofit Jobs matching PostgreSQL 'asset_retrofits' table
const INITIAL_RETROFIT_JOBS: RetrofitJob[] = [
  {
    id: "RTF-101",
    resultAssetId: "AST-RTF-199",
    resultAssetSku: "HW-ONT-992-RFT",
    resultAssetName: "Huawei HG8145V5 Retrofit",
    resultAssetSerial: "SN-HUA992-RFT-01",
    performedBy: "USR-001",
    performedByName: "Andi Prasetya (Admin)",
    performedAt: "2026-05-25T14:30:00Z",
    woNumber: "WO-RETROFIT-001",
    notes: "Merakit unit board logic dari ZTE-ONT-404 ke dalam sasis bersih milik HW-ONT-992 (Broken Board). Diuji coba dan berfungsi 100% normal.",
    components: [
      {
        sourceAssetId: "AST-002",
        sku: "HW-ONT-992",
        name: "Huawei HG8145V5 ONT (Broken Board)",
        serialNumber: "SN-HUA88910",
        componentRole: "Chassis & Housing",
      },
      {
        sourceAssetId: "AST-003",
        sku: "ZTE-ONT-404",
        name: "ZTE F609 GPON ONT (Broken Chassis)",
        serialNumber: "SN-ZTE40498",
        componentRole: "Logic Board Module",
      },
    ],
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

  // Serialized Assets & Retrofitting States (Matching DDL Schema)
  serializedAssets: WarehouseAsset[];
  retrofitJobs: RetrofitJob[];
  retrofitDialogOpen: boolean;
  setRetrofitDialogOpen: (open: boolean) => void;
  addRetrofitJob: (job: Omit<RetrofitJob, "id" | "performedAt" | "performedBy" | "performedByName" | "resultAssetId">) => void;
  updateAssetStatus: (id: string, status: WarehouseAsset["status"]) => void;
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

  // Serialized Assets & Retrofitting Actions
  serializedAssets: INITIAL_SERIALIZED_ASSETS,
  retrofitJobs: INITIAL_RETROFIT_JOBS,
  retrofitDialogOpen: false,
  setRetrofitDialogOpen: (open) => set({ retrofitDialogOpen: open }),

  addRetrofitJob: (newJob) =>
    set((state) => {
      const jobId = `RTF-${state.retrofitJobs.length + 102}`;
      const performedAt = new Date().toISOString();
      const performedBy = "USR-001";
      const performedByName = "Andi Prasetya (Admin)";

      // 1. Mark source assets as cannibalized
      const sourceIds = newJob.components.map((c) => c.sourceAssetId);
      const updatedAssets = state.serializedAssets.map((asset) => {
        if (sourceIds.includes(asset.id)) {
          return { ...asset, status: "cannibalized" as const };
        }
        return asset;
      });

      // 2. Create the result asset in warehouse stock
      const resultAssetId = `AST-RTF-${state.serializedAssets.length + 200}`;
      const resultSerial = newJob.resultAssetSerial || `SN-RTF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const newResultAsset: WarehouseAsset = {
        id: resultAssetId,
        stockItemId: "HW-ONT-992-RFT",
        sku: newJob.resultAssetSku,
        name: newJob.resultAssetName,
        category: "customer_equipment",
        serialNumber: resultSerial,
        qrCode: `ION-RFT-00${state.serializedAssets.length + 100}`,
        receivedAt: performedAt,
        purchaseCost: 350000.00, // lower cost valuation for cannibalized units
        warehouseId: "WH-BDG-UTR-01",
        warehouseName: "Gudang Bandung Utara",
        status: "in_warehouse",
        isRetrofit: true,
      };

      // 3. Add the job and new assets
      const job: RetrofitJob = {
        ...newJob,
        id: jobId,
        resultAssetId,
        resultAssetSerial: resultSerial,
        performedBy,
        performedByName,
        performedAt,
      };

      return {
        serializedAssets: [newResultAsset, ...updatedAssets],
        retrofitJobs: [job, ...state.retrofitJobs],
      };
    }),

  updateAssetStatus: (id, status) =>
    set((state) => ({
      serializedAssets: state.serializedAssets.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),
}));
