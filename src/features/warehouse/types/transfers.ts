import type { StockTransfer, TransferStatus } from "./index";

export interface TransfersListParams {
  page: number;
  limit: number;
  search?: string;
}

/** List row from GET /warehouse/frontend/transfers (items omitted on list). */
export interface TransfersListItem {
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
  notes?: string;
}

export interface TransfersListResponse {
  data: TransfersListItem[];
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

export interface TransferDetailResponse {
  data: StockTransfer;
}

export interface TransferItemInput {
  stock_item_id: number;
  quantity?: number;
  received_qty?: number;
  asset_id?: number;
  batch_id?: number;
}

export interface UpdateTransferStatusRequest {
  status: TransferStatus;
  items?: TransferItemInput[];
  actor?: string;
  actorBranchCode?: string;
  actorRole?: string;
}

export interface UpdateTransferStatusResponse {
  data?: StockTransfer;
}

export interface CreateTransferRequest {
  transfer_number: string;
  requested_by: string;
  source_warehouse_id: number;
  target_warehouse_id: number;
  items: TransferItemInput[];
}

export interface CreateTransferResponse {
  data?: StockTransfer;
}

export function toStockTransfer(item: TransfersListItem): StockTransfer {
  return {
    ...item,
    items: [],
  };
}

export function toStockTransfers(items: TransfersListItem[]): StockTransfer[] {
  return items.map(toStockTransfer);
}
