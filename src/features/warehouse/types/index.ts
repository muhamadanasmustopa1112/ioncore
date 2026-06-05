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
  category: string;
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

export interface DashboardSummaryResponse {
  data: {
    metrics: WarehouseMetrics;
    ontDistribution: OntDistributionData[];
    branchStockLevels: BranchStockLevelData[];
    lowStockAlerts: LowStockAlertData[];
  };
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
  category: "customer_equipment" | "field_tool" | "infrastructure_equipment" | "infrastructure";
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
  // Infrastructure Lifecycle Fields (PRD Section 4.4)
  purchaseDate?: string;
  distributorName?: string;
  purchaseOrderReference?: string;
  warrantyExpiryDate?: string;
  deploymentStatus?: DeploymentStatus;
  deploymentLocation?: DeploymentLocation;
  networkNodeId?: string;
  maintenanceScheduleId?: string;
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

export type StockItemCategory = string;
export type StockItemType = "serialized" | "cable" | "consumable";
export type InventoryValuationMethod = "FIFO" | "LIFO";

// ─── Universal Asset Form Types ──────────────────────────────────────────────

export type AssetType = "serialized" | "cable" | "consumable" | "infrastructure";

export type SerializedCategory = "ONT" | "Router" | "Switch" | "ODP_Box" | "Media_Converter" | "Patch_Panel";
export type CableCategory = "Fiber_Optic" | "Ethernet" | "Coaxial" | "Power";
export type ConsumableCategory = "Connector" | "Fastener" | "Patch_Cord" | "Labeling" | "Mounting";
export type InfrastructureCategory = "ODP" | "OLT" | "Mikrotik" | "Switch" | "Rack" | "Power_Supply";

export type AssetCategory = SerializedCategory | CableCategory | ConsumableCategory | InfrastructureCategory;

export type OwnershipType = "ion_owned" | "leased_to_customer" | "customer_owned";
export type DeviceConditionType = "new" | "refurbished" | "damaged";
export type InfraCondition = "new" | "active" | "under_maintenance" | "decommissioned";

export interface UniversalAssetFormData {
  // Common
  assetType: AssetType;
  category: AssetCategory;
  name: string;
  sku: string;
  brand: string;
  model: string;
  uom: string;
  unitCost?: number;
  description?: string;
  threshold: number;
  receivedBy: string;

  // Serialized
  serialNumber?: string;
  macAddress?: string;
  firmwareVersion?: string;
  ownershipType?: OwnershipType;
  deviceCondition?: DeviceConditionType;
  purchaseCost?: number;
  receivedAt?: string;
  isRetrofit?: boolean;

  // Cable
  specification?: string;
  totalLength?: number;
  costPerMeter?: number;

  // Consumable
  consumableSpec?: string;
  quantityInStock?: number;
  costPerUnit?: number;

  // Infrastructure
  purchaseDate?: string;
  distributorName?: string;
  purchasePrice?: number;
  purchaseOrderReference?: string;
  warrantyExpiryDate?: string;
  infraCondition?: InfraCondition;
  deploymentStatus?: DeploymentStatus;
  deploymentLocation?: string;
  networkNodeId?: string;
}

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  serialized: "Serialized Device",
  cable: "Cable / Length-Based",
  consumable: "Consumable / Quantity-Based",
  infrastructure: "Network Infrastructure",
};

export const SERIALIZED_CATEGORIES: { value: SerializedCategory; label: string }[] = [
  { value: "ONT", label: "ONT (GPON/EPON)" },
  { value: "Router", label: "Wi-Fi Router" },
  { value: "Switch", label: "Managed Switch" },
  { value: "ODP_Box", label: "ODP Box" },
  { value: "Media_Converter", label: "Media Converter" },
  { value: "Patch_Panel", label: "Patch Panel" },
];

export const CABLE_CATEGORIES: { value: CableCategory; label: string }[] = [
  { value: "Fiber_Optic", label: "Fiber Optic" },
  { value: "Ethernet", label: "Ethernet (Cat6/Cat7)" },
  { value: "Coaxial", label: "Coaxial" },
  { value: "Power", label: "Power Cable" },
];

export const CONSUMABLE_CATEGORIES: { value: ConsumableCategory; label: string }[] = [
  { value: "Connector", label: "Connector" },
  { value: "Fastener", label: "Fastener (Cable Tie, Clip)" },
  { value: "Patch_Cord", label: "Patch Cord" },
  { value: "Labeling", label: "Labeling" },
  { value: "Mounting", label: "Mounting Hardware" },
];

export const INFRASTRUCTURE_CATEGORIES: { value: InfrastructureCategory; label: string }[] = [
  { value: "ODP", label: "ODP" },
  { value: "OLT", label: "OLT" },
  { value: "Mikrotik", label: "Mikrotik Router" },
  { value: "Switch", label: "Core Switch" },
  { value: "Rack", label: "Rack" },
  { value: "Power_Supply", label: "Power Supply Unit" },
];

export const OWNERSHIP_OPTIONS: { value: OwnershipType; label: string }[] = [
  { value: "ion_owned", label: "ION-Owned" },
  { value: "leased_to_customer", label: "Leased to Customer" },
  { value: "customer_owned", label: "Customer-Owned" },
];

export const DEVICE_CONDITION_OPTIONS: { value: DeviceConditionType; label: string }[] = [
  { value: "new", label: "New" },
  { value: "refurbished", label: "Refurbished" },
  { value: "damaged", label: "Damaged" },
];

export const INFRA_CONDITION_OPTIONS: { value: InfraCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "active", label: "Active" },
  { value: "under_maintenance", label: "Under Maintenance" },
  { value: "decommissioned", label: "Decommissioned" },
];

export const DEPLOYMENT_STATUS_OPTIONS: { value: DeploymentStatus; label: string }[] = [
  { value: "in_warehouse", label: "In Warehouse" },
  { value: "deployed", label: "Deployed" },
  { value: "under_maintenance", label: "Under Maintenance" },
  { value: "decommissioned", label: "Decommissioned" },
];

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
  unitCost?: number;
  currentStock: number;
  threshold: number;
  uom: string;
  alertStatus: StockAlertStatus;
}

// ─── Inventory Valuation Configuration ───────────────────────────────────────

export interface InventoryValuationConfig {
  warehouseId: string;
  warehouseName: string;
  valuationMethod: InventoryValuationMethod;
  configuredBy: string;
  configuredAt: string;
  notes?: string;
}

// ─── Dispatch / WO BOM ───────────────────────────────────────────────────────

export type DispatchStatus =
  | "pending"
  | "preparing"
  | "dispatched"
  | "completed"
  | "IN_TRANSIT"
  | "PENDING"
  | "PREPARING"
  | "DISPATCHED"
  | "COMPLETED"
  | "SIGNED_OFF"
  | string;

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
  dispatchNumber?: string;
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
export type DeploymentStatus = "in_warehouse" | "deployed" | "under_maintenance" | "decommissioned";

export interface DeploymentLocation {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  branchId: string;
  branchName: string;
  nodeId?: string;
}

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

export type { SerializedAssetsListParams, SerializedAssetsListResponse } from "./serialized-assets";
export type { RetrofitsListParams, RetrofitsListResponse } from "./retrofits";
export type { HandoversListParams, HandoversListResponse } from "./handovers";
export type { Category, CategoriesListResponse } from "./categories";
export type {
  CreateStockItemPayload,
  StockItemResponse,
  StockItemsListResponse,
} from "./stock-item";
export type {
  PurchaseReceiptLineInput,
  CreatePurchaseReceiptRequest,
  PurchaseReceiptResponse,
} from "./purchase-receipt";
export type { StockLevelsListParams, StockLevelsListResponse } from "./stock-levels";
