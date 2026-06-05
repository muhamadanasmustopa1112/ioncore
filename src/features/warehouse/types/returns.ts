import type { DeviceReturnRecord } from "./index";

export interface ReturnsListParams {
  page: number;
  limit: number;
  warehouse_id?: number;
  disposition?: string;
  asset_id?: number;
}

export interface ReturnsListItem {
  id: number;
  wo_id: string;
  asset_id: number;
  condition: string;
  disposition: string;
  received_warehouse_id: number;
  actor: string;
  created_at: string;
}

export interface ReturnsListResponse {
  data: ReturnsListItem[];
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

export function toDeviceReturnRecord(item: ReturnsListItem): DeviceReturnRecord {
  return {
    id: String(item.id),
    assetId: String(item.asset_id),
    assetName: `Asset #${item.asset_id}`,
    assetSku: "—",
    serialNumber: "—",
    qrCode: "—",
    woNumber: item.wo_id,
    woId: item.wo_id,
    customerName: "—",
    customerId: "—",
    ownership: "ion_owned",
    status: "received",
    condition: item.condition.toLowerCase() as DeviceReturnRecord["condition"],
    dateInitiated: item.created_at,
    warehouseId: String(item.received_warehouse_id),
    receivedBy: item.actor,
    notes: item.disposition,
  };
}

export interface CreateReturnRequest {
  actor: string;
  asset_id: number;
  condition: string;
  disposition: string;
  received_warehouse_id: number;
  wo_id: string;
}

export interface CreateReturnResponse {
  data?: ReturnsListItem;
}
