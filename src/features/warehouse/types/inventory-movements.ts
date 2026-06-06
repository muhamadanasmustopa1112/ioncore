/** API query filters for GET /warehouse/reports/inventory-movements */
export interface InventoryMovementsFilterParams {
  warehouse_id?: number;
  stock_item_id?: number;
  asset_id?: number;
  batch_id?: number;
  category_id?: number;
  movement_type?: string;
  reference_id?: string;
}

export interface InventoryMovementsListParams
  extends InventoryMovementsFilterParams {
  page: number;
  limit: number;
}

export interface InventoryMovementItem {
  id: number;
  warehouse_id: number;
  warehouse_code: string;
  warehouse_name: string;
  stock_item_id: number;
  sku: string;
  item_name: string;
  unit: string;
  asset_id: number | null;
  asset_serial_number: string | null;
  movement_type: string;
  quantity: number;
  reference_type: string;
  reference_id: string;
  actor: string;
  metadata: string | null;
  created_at: string;
}

export interface InventoryMovementsListResponse {
  data: InventoryMovementItem[];
  metadata: {
    current_page: number;
    limit: number;
    total_page: number;
    total_data: number;
    sort_by: string;
    sort_order: string;
    filter_by: string;
  };
}

export function decodeMovementMetadata(
  metadata?: string | null
): Record<string, unknown> | null {
  if (!metadata) return null;
  try {
    return JSON.parse(atob(metadata)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getMovementTypeVariant(
  type: string
): "info" | "secondary" | "destructive" | "success" | "warning" {
  const upper = type.toUpperCase();
  if (upper.includes("DISPATCH") || upper.includes("OUT")) return "info";
  if (
    upper.includes("RESTOCK") ||
    upper.includes("RECEIVE") ||
    upper.includes("IN")
  ) {
    return "success";
  }
  if (upper.includes("TRANSFER") || upper.includes("REFURBISH")) return "warning";
  if (upper.includes("ADJUST") || upper.includes("OPNAME")) return "destructive";
  return "secondary";
}
