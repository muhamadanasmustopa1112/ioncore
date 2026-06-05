import type { CreateDispatchRequest, DispatchItemInput } from "../types/dispatches";
import type { DispatchQrKind } from "./parse-dispatch-qr";

export interface DispatchItemFormLine {
  id: string;
  qr_payload: string;
  kind: DispatchQrKind;
  stock_item_id: number;
  work_order_material_id: number;
  quantity: number;
  asset_id?: number;
  batch_id?: number;
}

export interface DispatchHeaderFormValues {
  dispatch_number: string;
  wo_id: string;
  technician_user_id: string;
  source_warehouse_id: number;
}

function toDispatchItemInput(line: DispatchItemFormLine): DispatchItemInput {
  const item: DispatchItemInput = {
    stock_item_id: line.stock_item_id,
    work_order_material_id: line.work_order_material_id,
    quantity: line.quantity,
    qr_payload: line.qr_payload,
  };

  if (line.kind === "asset" && line.asset_id && line.asset_id > 0) {
    item.asset_id = line.asset_id;
  }

  if (line.kind === "batch" && line.batch_id && line.batch_id > 0) {
    item.batch_id = line.batch_id;
  }

  if (line.kind === "unknown") {
    if (line.asset_id && line.asset_id > 0) {
      item.asset_id = line.asset_id;
    }
    if (line.batch_id && line.batch_id > 0) {
      item.batch_id = line.batch_id;
    }
  }

  return item;
}

export function validateDispatchForm(
  header: DispatchHeaderFormValues,
  items: DispatchItemFormLine[]
): string | null {
  if (!header.dispatch_number.trim()) return "Dispatch number is required";
  if (!header.wo_id.trim()) return "WO ID is required";
  if (!header.technician_user_id.trim()) return "Technician is required";
  if (!header.source_warehouse_id || header.source_warehouse_id < 1) {
    return "Warehouse is required";
  }
  if (items.length === 0) return "At least one scanned item is required";

  for (const [index, line] of items.entries()) {
    if (!line.qr_payload.trim()) {
      return `Item ${index + 1}: QR payload is required`;
    }
    if (!line.stock_item_id || line.stock_item_id < 1) {
      return `Item ${index + 1}: Stock item ID is required`;
    }
    if (!line.work_order_material_id || line.work_order_material_id < 1) {
      return `Item ${index + 1}: Work order material ID is required`;
    }
    if (!line.quantity || line.quantity < 1) {
      return `Item ${index + 1}: Quantity must be at least 1`;
    }
  }

  return null;
}

export function buildCreateDispatchPayload(
  header: DispatchHeaderFormValues,
  items: DispatchItemFormLine[]
): CreateDispatchRequest {
  return {
    dispatch_number: header.dispatch_number.trim(),
    wo_id: header.wo_id.trim(),
    technician_user_id: header.technician_user_id.trim(),
    source_warehouse_id: header.source_warehouse_id,
    items: items.map(toDispatchItemInput),
  };
}
