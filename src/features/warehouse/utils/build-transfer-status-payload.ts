import type { TransferStatus } from "../types";
import type {
  TransferItemInput,
  UpdateTransferStatusRequest,
} from "../types/transfers";

export type TransferStatusPayloadInput = {
  status: TransferStatus;
  items: Array<{
    stockItemId: string;
    qty: number;
    receivedQty?: number;
  }>;
};

export function buildTransferStatusPayload(
  transferId: string,
  values: TransferStatusPayloadInput
): { id: string; payload: UpdateTransferStatusRequest } {
  const items: TransferItemInput[] = values.items.map((item) => {
    const input: TransferItemInput = {
      stock_item_id: Number(item.stockItemId),
      quantity: item.qty,
    };

    if (values.status === "received" && item.receivedQty != null) {
      input.received_qty = item.receivedQty;
    }

    return input;
  });

  return {
    id: transferId,
    payload: {
      status: values.status,
      items,
    },
  };
}
