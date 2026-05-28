import { create } from "zustand";
import {
  LowStockAlertData,
  WorkOrder,
  HandoverRecord,
  WarehouseAsset,
  RetrofitJob,
  StockLevel,
  DispatchRecord,
  StockTransfer,
  StockOpname,
  DeviceReturnRecord,
  OpnameItemCount,
} from "../types";
import {
  DUMMY_STOCK_LEVELS,
  DUMMY_DISPATCHES,
  DUMMY_TRANSFERS,
  DUMMY_OPNAMES,
  DUMMY_DEVICE_RETURNS,
} from "../data/dummy-subfeatures";

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

  // Serialized Assets & Retrofitting States
  serializedAssets: WarehouseAsset[];
  retrofitJobs: RetrofitJob[];
  retrofitDialogOpen: boolean;
  setRetrofitDialogOpen: (open: boolean) => void;
  addRetrofitJob: (job: Omit<RetrofitJob, "id" | "performedAt" | "performedBy" | "performedByName" | "resultAssetId">) => void;
  updateAssetStatus: (id: string, status: WarehouseAsset["status"]) => void;

  // Stock Levels (sub-feature)
  stockLevels: StockLevel[];
  updateThreshold: (id: string, threshold: number) => void;
  stockForm: "new" | "edit" | "details" | null;
  stockSheetOpen: boolean;
  selectedStock: StockLevel | null;
  openStockFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeStockFormSheet: () => void;
  setSelectedStock: (stock: StockLevel | null) => void;

  // Receive (sub-feature - reuses StockLevel data)
  receiveForm: "new" | "edit" | "details" | null;
  receiveSheetOpen: boolean;
  selectedReceive: StockLevel | null;
  openReceiveFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeReceiveFormSheet: () => void;
  setSelectedReceive: (receive: StockLevel | null) => void;

  // Dispatch (sub-feature)
  dispatches: DispatchRecord[];
  updateDispatchStatus: (id: string, status: DispatchRecord["status"]) => void;
  dispatchForm: "new" | "edit" | "details" | null;
  dispatchSheetOpen: boolean;
  selectedDispatch: DispatchRecord | null;
  openDispatchFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeDispatchFormSheet: () => void;
  setSelectedDispatch: (dispatch: DispatchRecord | null) => void;

  // Transfers (sub-feature)
  transfers: StockTransfer[];
  updateTransferStatus: (id: string, status: StockTransfer["status"]) => void;
  transferForm: "new" | "edit" | "details" | null;
  transferSheetOpen: boolean;
  selectedTransfer: StockTransfer | null;
  openTransferFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeTransferFormSheet: () => void;
  setSelectedTransfer: (transfer: StockTransfer | null) => void;

  // Opname (sub-feature)
  opnames: StockOpname[];
  updateOpnameCount: (opnameId: string, stockItemId: string, counted: number) => void;
  opnameForm: "new" | "edit" | "details" | null;
  opnameSheetOpen: boolean;
  selectedOpname: StockOpname | null;
  openOpnameFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeOpnameFormSheet: () => void;
  setSelectedOpname: (opname: StockOpname | null) => void;

  // Device Returns (sub-feature)
  deviceReturns: DeviceReturnRecord[];
  updateReturnStatus: (id: string, status: DeviceReturnRecord["status"], condition?: DeviceReturnRecord["condition"]) => void;
  returnForm: "new" | "edit" | "details" | null;
  returnSheetOpen: boolean;
  selectedReturn: DeviceReturnRecord | null;
  openReturnFormSheet: (form: "new" | "edit" | "details" | null) => void;
  closeReturnFormSheet: () => void;
  setSelectedReturn: (returnRecord: DeviceReturnRecord | null) => void;
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
        purchaseCost: 350000.00,
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

  // Stock Levels
  stockLevels: DUMMY_STOCK_LEVELS,
  updateThreshold: (id, threshold) =>
    set((state) => ({
      stockLevels: state.stockLevels.map((sl) =>
        sl.id === id
          ? {
              ...sl,
              threshold,
              alertStatus:
                sl.currentStock <= threshold * 0.5
                  ? "Critical"
                  : sl.currentStock <= threshold
                  ? "Warning"
                  : "OK",
            }
          : sl
      ),
    })),
  stockForm: "new",
  stockSheetOpen: false,
  selectedStock: null,
  openStockFormSheet: (form) => set((state) => ({ ...state, stockForm: form, stockSheetOpen: true })),
  closeStockFormSheet: () => set((state) => ({ ...state, stockForm: null, stockSheetOpen: false })),
  setSelectedStock: (stock) => set((state) => ({ ...state, selectedStock: stock })),

  // Receive
  receiveForm: "new",
  receiveSheetOpen: false,
  selectedReceive: null,
  openReceiveFormSheet: (form) => set((state) => ({ ...state, receiveForm: form, receiveSheetOpen: true })),
  closeReceiveFormSheet: () => set((state) => ({ ...state, receiveForm: null, receiveSheetOpen: false })),
  setSelectedReceive: (receive) => set((state) => ({ ...state, selectedReceive: receive })),

  // Dispatches
  dispatches: DUMMY_DISPATCHES,
  updateDispatchStatus: (id, status) =>
    set((state) => ({
      dispatches: state.dispatches.map((d) =>
        d.id === id ? { ...d, status, dateDispatched: status === "dispatched" ? new Date().toISOString() : d.dateDispatched } : d
      ),
    })),
  dispatchForm: "new",
  dispatchSheetOpen: false,
  selectedDispatch: null,
  openDispatchFormSheet: (form) => set((state) => ({ ...state, dispatchForm: form, dispatchSheetOpen: true })),
  closeDispatchFormSheet: () => set((state) => ({ ...state, dispatchForm: null, dispatchSheetOpen: false })),
  setSelectedDispatch: (dispatch) => set((state) => ({ ...state, selectedDispatch: dispatch })),

  // Transfers
  transfers: DUMMY_TRANSFERS,
  updateTransferStatus: (id, status) =>
    set((state) => ({
      transfers: state.transfers.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              dateDispatched: status === "in_transit" ? new Date().toISOString() : t.dateDispatched,
              dateReceived: status === "received" ? new Date().toISOString() : t.dateReceived,
            }
          : t
      ),
    })),
  transferForm: "new",
  transferSheetOpen: false,
  selectedTransfer: null,
  openTransferFormSheet: (form) => set((state) => ({ ...state, transferForm: form, transferSheetOpen: true })),
  closeTransferFormSheet: () => set((state) => ({ ...state, transferForm: null, transferSheetOpen: false })),
  setSelectedTransfer: (transfer) => set((state) => ({ ...state, selectedTransfer: transfer })),

  // Opname
  opnames: DUMMY_OPNAMES,
  updateOpnameCount: (opnameId, stockItemId, counted) =>
    set((state) => ({
      opnames: state.opnames.map((o) => {
        if (o.id !== opnameId) return o;
        const updatedItems = o.items.map((item) => {
          if (item.stockItemId !== stockItemId) return item;
          const variance = counted - item.systemCount;
          return {
            ...item,
            countedCount: counted,
            variance,
            status: (variance === 0 ? "adjusted" : "discrepancy") as OpnameItemCount["status"],
          };
        });
        const totalDiscrepancies = updatedItems.filter((i) => i.variance !== 0).length;
        return { ...o, items: updatedItems, totalDiscrepancies };
      }),
    })),
  opnameForm: "new",
  opnameSheetOpen: false,
  selectedOpname: null,
  openOpnameFormSheet: (form) => set((state) => ({ ...state, opnameForm: form, opnameSheetOpen: true })),
  closeOpnameFormSheet: () => set((state) => ({ ...state, opnameForm: null, opnameSheetOpen: false })),
  setSelectedOpname: (opname) => set((state) => ({ ...state, selectedOpname: opname })),

  // Device Returns
  deviceReturns: DUMMY_DEVICE_RETURNS,
  updateReturnStatus: (id, status, condition) =>
    set((state) => ({
      deviceReturns: state.deviceReturns.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              condition: condition ?? r.condition,
              dateReceived: status === "received" ? new Date().toISOString() : r.dateReceived,
            }
          : r
      ),
    })),
  returnForm: "new",
  returnSheetOpen: false,
  selectedReturn: null,
  openReturnFormSheet: (form) => set((state) => ({ ...state, returnForm: form, returnSheetOpen: true })),
  closeReturnFormSheet: () => set((state) => ({ ...state, returnForm: null, returnSheetOpen: false })),
  setSelectedReturn: (returnRecord) => set((state) => ({ ...state, selectedReturn: returnRecord })),
}));
