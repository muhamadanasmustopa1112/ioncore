import type {
  CreateTransferRequest,
  TransferItemInput,
} from "../types/transfers";

export type CreateTransferFormItem = {
  stock_item_id: number;
  quantity: number;
  asset_id?: number;
  batch_id?: number;
  received_qty?: number;
};

export type CreateTransferFormValues = {
  transfer_number: string;
  requested_by: string;
  source_warehouse_id: number;
  target_warehouse_id: number;
  items: CreateTransferFormItem[];
};

function toTransferItemInput(item: CreateTransferFormItem): TransferItemInput {
  const input: TransferItemInput = {
    stock_item_id: item.stock_item_id,
    quantity: item.quantity,
  };

  if (item.asset_id != null && item.asset_id > 0) {
    input.asset_id = item.asset_id;
  }

  if (item.batch_id != null && item.batch_id > 0) {
    input.batch_id = item.batch_id;
  }

  if (item.received_qty != null && item.received_qty > 0) {
    input.received_qty = item.received_qty;
  }

  return input;
}

export function buildCreateTransferPayload(
  values: CreateTransferFormValues
): CreateTransferRequest {
  return {
    transfer_number: values.transfer_number.trim(),
    requested_by: values.requested_by.trim(),
    source_warehouse_id: values.source_warehouse_id,
    target_warehouse_id: values.target_warehouse_id,
    items: values.items.map(toTransferItemInput),
  };
}

export function generateTransferNumber(): string {
  return `XFER-${Date.now()}`;
}
