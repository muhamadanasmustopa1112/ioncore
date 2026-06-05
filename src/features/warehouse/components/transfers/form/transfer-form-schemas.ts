import * as z from "zod";
import type { TransferStatus } from "@/features/warehouse/types";

export const TRANSFER_STATUS_OPTIONS: {
  value: TransferStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In Transit" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" },
];

export const newTransferItemSchema = z.object({
  stock_item_id: z.number().min(1, "Stock item is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  asset_id: z.number().optional(),
  batch_id: z.number().optional(),
  received_qty: z.number().min(0).optional(),
});

export const newTransferSchema = z
  .object({
    transfer_number: z.string().min(1, "Transfer number is required"),
    requested_by: z.string().min(1, "Requested by is required"),
    source_warehouse_id: z.number().min(1, "Source warehouse is required"),
    target_warehouse_id: z.number().min(1, "Destination warehouse is required"),
    items: z
      .array(newTransferItemSchema)
      .min(1, "At least one item is required"),
  })
  .refine((data) => data.source_warehouse_id !== data.target_warehouse_id, {
    message: "Source and destination must be different",
    path: ["target_warehouse_id"],
  });

export const editTransferItemSchema = z.object({
  id: z.string(),
  stockItemId: z.string(),
  stockItemName: z.string(),
  stockItemSku: z.string(),
  itemType: z.string(),
  uom: z.string(),
  qty: z.number().min(1, "Quantity must be at least 1"),
  receivedQty: z.number().min(0).optional(),
});

export const editTransferSchema = z.object({
  status: z.enum(["pending", "in_transit", "received", "cancelled"]),
  notes: z.string().optional(),
  items: z.array(editTransferItemSchema).min(1, "At least one item is required"),
});

export type NewTransferFormValues = z.infer<typeof newTransferSchema>;
export type EditTransferFormValues = z.infer<typeof editTransferSchema>;
