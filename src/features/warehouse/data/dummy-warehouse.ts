import {
  OntDistributionData,
  BranchStockLevelData,
  LowStockAlertData,
  TechnicianEquipmentData,
  WarehouseMetrics,
} from "../types";

export const DUMMY_METRICS: WarehouseMetrics = {
  totalWarehouses: 12,
  totalWarehousesDelta: "0%",
  installedOnt: 8450,
  warehouseOnt: 2100,
  ontRatioDelta: "+5.2%",
  fiberStockKm: 450,
  fiberStockDelta: "-2.1%",
  fiberStockTrend: "down",
};

export const DUMMY_ONT_DISTRIBUTION: OntDistributionData[] = [
  { name: "Installed", value: 8450, color: "var(--color-installed)", percentage: "80%" },
  { name: "Warehouse", value: 2100, color: "var(--color-warehouse)", percentage: "20%" },
];

export const DUMMY_BRANCH_STOCK_LEVELS: BranchStockLevelData[] = [
  { branch: "North", units: 65 },
  { branch: "South", units: 85 },
  { branch: "East", units: 45 },
  { branch: "West", units: 70 },
  { branch: "Central", units: 55 },
];

export const DUMMY_LOW_STOCK_ALERTS: LowStockAlertData[] = [
  {
    id: "1",
    name: "Huawei HG8145V5",
    sku: "HW-ONT-992",
    units: 42,
    threshold: 100,
    status: "Critical",
    category: "Equipment",
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
    uom: "meters",
  },
  {
    id: "3",
    name: "Splitter 1:8 PLC",
    sku: "SPL-18-PLC",
    units: 85,
    threshold: 120,
    status: "Warning",
    category: "Connectors",
    uom: "pieces",
  },
];

export const DUMMY_TECHNICIAN_EQUIPMENT: TechnicianEquipmentData[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Tech",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    assetName: "Splicer Kit X-30",
    assetSku: "SP-339210-22",
    dateIssued: "Oct 12, 2023",
    status: "In Use",
  },
  {
    id: "2",
    name: "Sarah Lee",
    role: "Field Engineer",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    assetName: "OTDR Tester Mini",
    assetSku: "OT-552109-88",
    dateIssued: "Oct 14, 2023",
    status: "In Use",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Maintenance",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    assetName: "Ladder 3.5m Ext",
    assetSku: "LAD-99120",
    dateIssued: "Oct 10, 2023",
    status: "Pending",
  },
];
