import { z } from "zod";
import type { InventoryValuationConfig, InventoryValuationMethod } from "../../types";

export type { InventoryValuationConfig, InventoryValuationMethod };

export const inventoryConfigSchema = z.object({
  warehouseId: z.string().min(1, "Warehouse ID is required"),
  warehouseName: z.string().min(1, "Warehouse name is required"),
  valuationMethod: z.enum(["FIFO", "LIFO"], {
    message: "Please select FIFO or LIFO",
  }),
  notes: z.string().optional(),
});

export type InventoryConfigFormData = z.infer<typeof inventoryConfigSchema>;

export type InventoryConfigParams = {
  draw: number;
  start: number;
  length: number;
  search?: string;
};

export type InventoryConfigResponse = {
  data: InventoryValuationConfig[];
  metadata?: {
    total_data: number;
    total_page: number;
  };
};
