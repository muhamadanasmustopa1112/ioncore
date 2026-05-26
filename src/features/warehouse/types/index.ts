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

// Representing the serialized 'assets' table in the database
export interface WarehouseAsset {
  id: string;
  stockItemId: string; // references stock_items
  sku: string;
  name: string;
  category: "customer_equipment" | "field_tool" | "infrastructure_equipment";
  serialNumber: string; // unique serial, nullable in DDL
  qrCode: string; // unique QR
  receivedAt: string; // date unit entered warehouse
  purchaseCost: number; // valuation cost
  warehouseId?: string; // references warehouses
  warehouseName?: string;
  status:
    | "in_warehouse"
    | "dispatched"
    | "installed"
    | "assigned"
    | "in_use"
    | "under_maintenance"
    | "defective"
    | "disposed"
    | "returned"
    | "cannibalized";
  isRetrofit: boolean;
  customerId?: string; // references customers
  customerName?: string;
  assignedTechnicianId?: string; // references users
  assignedTechnicianName?: string;
  woId?: string; // references work_orders
  woNumber?: string;
  branchId?: string; // references branches
  branchName?: string;
}

// Representing source parts used in a retrofit ('asset_retrofit_components' table)
export interface RetrofitComponent {
  sourceAssetId: string;
  sku: string;
  name: string;
  serialNumber: string;
  componentRole: string; // e.g. 'logic_board', 'chassis', 'power_unit', 'housing'
}

// Representing a retrofit job ('asset_retrofits' table)
export interface RetrofitJob {
  id: string;
  resultAssetId: string;
  resultAssetSku: string;
  resultAssetName: string;
  resultAssetSerial?: string;
  performedBy: string; // technician/user
  performedByName: string;
  performedAt: string;
  woId?: string;
  woNumber?: string;
  notes: string;
  components: RetrofitComponent[];
}
