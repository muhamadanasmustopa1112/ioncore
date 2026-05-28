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
  technicianSignature: string;
  warehouseSignature: string;
  timestamp: string;
}

export interface WarehouseAsset {
  id: string;
  stockItemId: string;
  sku: string;
  name: string;
  category: "customer_equipment" | "field_tool" | "infrastructure_equipment";
  serialNumber: string;
  qrCode: string;
  receivedAt: string;
  purchaseCost: number;
  warehouseId?: string;
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
  customerId?: string;
  customerName?: string;
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  woId?: string;
  woNumber?: string;
  branchId?: string;
  branchName?: string;
}

export interface RetrofitComponent {
  sourceAssetId: string;
  sku: string;
  name: string;
  serialNumber: string;
  componentRole: string;
}

export interface RetrofitJob {
  id: string;
  resultAssetId: string;
  resultAssetSku: string;
  resultAssetName: string;
  resultAssetSerial?: string;
  performedBy: string;
  performedByName: string;
  performedAt: string;
  woId?: string;
  woNumber?: string;
  notes: string;
  components: RetrofitComponent[];
}

// ─── Stock Item (catalog entry) ──────────────────────────────────────────────

export type StockItemCategory = "serialized_device" | "cable" | "consumable" | "infrastructure";
export type StockItemType = "serialized" | "cable" | "consumable";

export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: StockItemCategory;
  itemType: StockItemType;
  brand: string;
  model: string;
  uom: string;
  unitCost: number;
  description?: string;
  active: boolean;
}

// ─── Stock Level (per warehouse per item) ────────────────────────────────────

export type StockAlertStatus = "OK" | "Warning" | "Critical";

export interface StockLevel {
  id: string;
  stockItemId: string;
  stockItemName: string;
  stockItemSku: string;
  stockItemCategory: StockItemCategory;
  stockItemType: StockItemType;
  warehouseId: string;
  warehouseName: string;
  warehouseBranch: string;
  currentStock: number;
  threshold: number;
  uom: string;
  alertStatus: StockAlertStatus;
}

// ─── Dispatch / WO BOM ───────────────────────────────────────────────────────

export type DispatchStatus = "pending" | "preparing" | "dispatched" | "completed";

export interface DispatchBomItem {
  id: string;
  stockItemId: string;
  stockItemName: string;
  stockItemSku: string;
  itemType: StockItemType;
  qtyRequired: number;
  qtyDispatched: number;
  uom: string;
  serialNumbers?: string[];
  qrCodes?: string[];
}

export interface DispatchRecord {
  id: string;
  woNumber: string;
  woType: string;
  technicianId: string;
  technicianName: string;
  technicianRole: string;
  warehouseId: string;
  warehouseName: string;
  status: DispatchStatus;
  dateCreated: string;
  dateDispatched?: string;
  items: DispatchBomItem[];
  notes?: string;
}

// ─── Stock Transfer ──────────────────────────────────────────────────────────

export type TransferStatus = "pending" | "in_transit" | "received" | "cancelled";

export interface TransferItem {
  id: string;
  stockItemId: string;
  stockItemName: string;
  stockItemSku: string;
  itemType: StockItemType;
  qty: number;
  uom: string;
}

export interface StockTransfer {
  id: string;
  sourceWarehouseId: string;
  sourceWarehouseName: string;
  destinationWarehouseId: string;
  destinationWarehouseName: string;
  status: TransferStatus;
  initiatedBy: string;
  initiatedByName: string;
  dateInitiated: string;
  dateDispatched?: string;
  dateReceived?: string;
  items: TransferItem[];
  notes?: string;
}

// ─── Stock Opname ────────────────────────────────────────────────────────────

export type OpnameStatus = "scheduled" | "in_progress" | "completed" | "adjusted";

export interface OpnameItemCount {
  stockItemId: string;
  stockItemName: string;
  stockItemSku: string;
  itemType: StockItemType;
  uom: string;
  systemCount: number;
  countedCount: number | null;
  variance: number;
  status: "pending" | "counted" | "discrepancy" | "adjusted";
  notes?: string;
}

export interface StockOpname {
  id: string;
  warehouseId: string;
  warehouseName: string;
  status: OpnameStatus;
  scheduledDate: string;
  startedAt?: string;
  completedAt?: string;
  initiatedBy: string;
  initiatedByName: string;
  items: OpnameItemCount[];
  totalDiscrepancies: number;
}

// ─── Device Return ───────────────────────────────────────────────────────────

export type ReturnStatus = "pending_return" | "received" | "restocked" | "decommissioned";
export type DeviceOwnership = "ion_owned" | "leased" | "customer_owned";
export type DeviceCondition = "good" | "damaged";

export interface DeviceReturnRecord {
  id: string;
  assetId: string;
  assetName: string;
  assetSku: string;
  serialNumber: string;
  qrCode: string;
  woNumber: string;
  woId: string;
  customerName: string;
  customerId: string;
  ownership: DeviceOwnership;
  status: ReturnStatus;
  condition?: DeviceCondition;
  dateInitiated: string;
  dateReceived?: string;
  warehouseId?: string;
  warehouseName?: string;
  receivedBy?: string;
  notes?: string;
  linkedNewWoId?: string;
}

// ─── Report Types ────────────────────────────────────────────────────────────

export interface StockMovementReport {
  id: string;
  date: string;
  stockItemName: string;
  stockItemSku: string;
  warehouseName: string;
  movementType: "dispatch" | "receive" | "transfer_in" | "transfer_out" | "adjustment" | "return";
  quantity: number;
  uom: string;
  reference: string;
  performedBy: string;
}

export interface ConsumptionReport {
  woNumber: string;
  technicianName: string;
  date: string;
  itemsConsumed: {
    name: string;
    sku: string;
    estimated: number;
    actual: number;
    uom: string;
  }[];
}
