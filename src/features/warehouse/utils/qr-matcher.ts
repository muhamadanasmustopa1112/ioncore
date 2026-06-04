import type { WarehouseAsset, StockLevel } from "../types";
import type { AssetWithReceivedBy } from "./csv-handler";

export type QRMatchType = "asset" | "stock_item" | "technician" | "unknown";

export interface QRMatchResult {
  type: QRMatchType;
  data?: WarehouseAsset | StockLevel | { id: string; name: string };
  rawValue: string;
}

export function matchScannedQR(
  scannedValue: string,
  assets: WarehouseAsset[],
  stockLevels: StockLevel[],
  inventoryItems: AssetWithReceivedBy[]
): QRMatchResult {
  const value = scannedValue.trim();

  const assetByQR = assets.find(
    (a) => a.qrCode.toLowerCase() === value.toLowerCase()
  );
  if (assetByQR) {
    return { type: "asset", data: assetByQR, rawValue: value };
  }

  const assetBySerial = assets.find(
    (a) => a.serialNumber.toLowerCase() === value.toLowerCase()
  );
  if (assetBySerial) {
    return { type: "asset", data: assetBySerial, rawValue: value };
  }

  const stockBySku = stockLevels.find(
    (s) => s.stockItemSku.toLowerCase() === value.toLowerCase()
  );
  if (stockBySku) {
    return { type: "stock_item", data: stockBySku, rawValue: value };
  }

  const itemBySku = inventoryItems.find(
    (i) => i.sku.toLowerCase() === value.toLowerCase()
  );
  if (itemBySku) {
    return {
      type: "stock_item",
      data: { id: itemBySku.id, name: itemBySku.name },
      rawValue: value,
    };
  }

  if (value.startsWith("TECH-")) {
    return {
      type: "technician",
      data: { id: value, name: `Technician ${value}` },
      rawValue: value,
    };
  }

  return { type: "unknown", rawValue: value };
}
