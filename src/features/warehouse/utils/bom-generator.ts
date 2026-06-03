import type { DispatchBomItem, StockItemType, StockLevel, WarehouseAsset, InventoryValuationMethod } from "../types";
import { BOM_TEMPLATES } from "../data/bom-templates";

export function generateBomItems(woType: string): DispatchBomItem[] {
  const template = BOM_TEMPLATES[woType];
  if (!template) return [];

  return template.items.map((item, index) => ({
    id: `BOM-${Date.now()}-${index}`,
    stockItemId: item.stockItemId,
    stockItemName: getStockItemName(item.stockItemId),
    stockItemSku: getStockItemSku(item.stockItemId),
    itemType: item.itemType,
    qtyRequired: item.qtyRequired,
    qtyDispatched: 0,
    uom: item.uom,
  }));
}

export function getSuggestedSerials(
  stockItemId: string,
  warehouseId: string,
  quantity: number,
  method: InventoryValuationMethod,
  serializedAssets: WarehouseAsset[]
): string[] {
  const available = serializedAssets
    .filter((a) => a.stockItemId === stockItemId && a.warehouseId === warehouseId && a.status === "in_warehouse")
    .sort((a, b) => {
      const dateA = new Date(a.receivedAt).getTime();
      const dateB = new Date(b.receivedAt).getTime();
      return method === "FIFO" ? dateA - dateB : dateB - dateA;
    });

  return available.slice(0, quantity).map((a) => a.serialNumber);
}

export function checkStockAvailability(
  bomItems: DispatchBomItem[],
  warehouseId: string,
  stockLevels: StockLevel[]
): { itemId: string; available: boolean; currentStock: number; required: number }[] {
  return bomItems.map((item) => {
    const level = stockLevels.find(
      (sl) => sl.stockItemId === item.stockItemId && sl.warehouseId === warehouseId
    );
    const currentStock = level?.currentStock ?? 0;
    return {
      itemId: item.stockItemId,
      available: currentStock >= item.qtyRequired,
      currentStock,
      required: item.qtyRequired,
    };
  });
}

function getStockItemName(id: string): string {
  const names: Record<string, string> = {
    "SI-001": "Huawei HG8145V5 ONT",
    "SI-002": "ZTE F609 GPON ONT",
    "SI-003": "TP-Link AX3000 Wi-Fi 6 Router",
    "SI-004": "Fiber Optic Cable SM G.657A2",
    "SI-005": "Cat6 UTP Cable",
    "SI-006": "SC/APC Connector",
    "SI-007": "Cable Tie 200mm",
    "SI-008": "Splitter 1:8 PLC Box",
    "SI-009": "ZTE GTGO OLT Card",
    "SI-010": "Mounting Bracket",
  };
  return names[id] ?? "Unknown Item";
}

function getStockItemSku(id: string): string {
  const skus: Record<string, string> = {
    "SI-001": "HW-ONT-992",
    "SI-002": "ZTE-ONT-404",
    "SI-003": "TPL-RT-3000",
    "SI-004": "FIB-SM-G657",
    "SI-005": "CAT6-UTP",
    "SI-006": "CONN-SCAPC",
    "SI-007": "TIE-200",
    "SI-008": "SPL-18-PLC",
    "SI-009": "ZTE-GTGO-CARD",
    "SI-010": "BRACKET-MNT",
  };
  return skus[id] ?? "UNKNOWN";
}
