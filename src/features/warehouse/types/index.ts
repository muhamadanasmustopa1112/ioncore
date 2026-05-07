export interface OntDistributionData {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

export interface BranchStockLevelData {
  branch: string;
  units: number;
}

export interface LowStockAlertData {
  id: string;
  name: string;
  sku: string;
  units: number;
  threshold: number;
  status: "Critical" | "Warning";
  category: "Cables" | "Equipment" | "Connectors";
  brand?: string;
  model?: string;
  uom: string;
}

export interface TechnicianEquipmentData {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  assetName: string;
  assetSku: string;
  dateIssued: string;
  status: "In Use" | "Pending";
}

export interface WarehouseMetrics {
  totalWarehouses: number;
  totalWarehousesDelta: string;
  installedOnt: number;
  warehouseOnt: number;
  ontRatioDelta: string;
  fiberStockKm: number;
  fiberStockDelta: string;
  fiberStockTrend: "up" | "down" | "neutral";
}

export interface HandoverEquipment {
  name: string;
  sku: string;
  qty: number;
  uom: string;
  serial?: string;
}

export interface WorkOrder {
  id: string;
  technicianName: string;
  technicianRole: string;
  avatarUrl: string;
  equipmentList: HandoverEquipment[];
  status: "Pending" | "Completed";
  dateCreated: string;
}

export interface HandoverRecord {
  id: string;
  workOrderId: string;
  technicianName: string;
  technicianSignature: string; // Base64
  warehouseSignature: string;  // Base64
  timestamp: string;
}
