import type { ApiDispatch, ApiDispatchItem } from "../types/dispatches";
import type { DispatchBomItem, DispatchRecord, StockItemType } from "../types";

const WAREHOUSE_NAMES: Record<number, string> = {
  1: "Gudang Jakarta Utara",
  2: "Gudang Bandung Utara",
  3: "Gudang Surabaya",
};

function getWarehouseName(id: number): string {
  return WAREHOUSE_NAMES[id] ?? `Warehouse #${id}`;
}

function deriveItemType(item: ApiDispatchItem): StockItemType {
  if (item.asset_id != null) return "serialized";
  if (item.batch_id != null) return "consumable";
  return "consumable";
}

function mapApiDispatchItem(item: ApiDispatchItem): DispatchBomItem {
  return {
    id: String(item.id),
    stockItemId: String(item.stock_item_id),
    stockItemName: "—",
    stockItemSku: "—",
    itemType: deriveItemType(item),
    qtyRequired: item.quantity,
    qtyDispatched: item.quantity,
    uom: "pcs",
    qrCodes: item.qr_payload ? [item.qr_payload] : undefined,
  };
}

export function mapApiDispatchToRecord(api: ApiDispatch): DispatchRecord {
  return {
    id: String(api.id),
    dispatchNumber: api.dispatch_number,
    woNumber: api.wo_id,
    woType: "—",
    technicianId: api.technician_user_id,
    technicianName: api.technician_user_id,
    technicianRole: "",
    warehouseId: String(api.source_warehouse_id),
    warehouseName: getWarehouseName(api.source_warehouse_id),
    status: api.status,
    dateCreated: api.created_at,
    dateDispatched: api.signed_off_at,
    items: api.items.map(mapApiDispatchItem),
  };
}

export function mapApiDispatchesToRecords(data: ApiDispatch[]): DispatchRecord[] {
  return data.map(mapApiDispatchToRecord);
}
