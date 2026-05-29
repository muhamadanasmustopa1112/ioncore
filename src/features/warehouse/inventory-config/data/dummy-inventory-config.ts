import type { InventoryValuationConfig } from "../types";

export const DUMMY_INVENTORY_CONFIG: InventoryValuationConfig[] = [
  {
    warehouseId: "WH-001",
    warehouseName: "Gudang Regional Jakarta Utara",
    valuationMethod: "FIFO",
    configuredBy: "Admin - Budi Santoso",
    configuredAt: "2025-01-15T08:30:00Z",
    notes: "FIFO chosen to prevent device obsolescence",
  },
  {
    warehouseId: "WH-002",
    warehouseName: "Gudang Area Jakarta Selatan",
    valuationMethod: "FIFO",
    configuredBy: "Admin - Siti Nurhaliza",
    configuredAt: "2025-01-16T10:00:00Z",
    notes: "Standard FIFO for all fast-moving items",
  },
  {
    warehouseId: "WH-003",
    warehouseName: "Gudang Sub Area Ciracas",
    valuationMethod: "LIFO",
    configuredBy: "Admin - Ahmad Fauzi",
    configuredAt: "2025-01-18T14:15:00Z",
    notes: "LIFO for cable items due to storage constraints",
  },
  {
    warehouseId: "WH-004",
    warehouseName: "Gudang Regional Bandung",
    valuationMethod: "FIFO",
    configuredBy: "Admin - Dewi Lestari",
    configuredAt: "2025-01-20T09:45:00Z",
    notes: "FIFO for all categories",
  },
];
