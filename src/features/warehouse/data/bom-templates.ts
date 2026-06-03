import type { StockItemType } from "../types";

export interface BomTemplateItem {
  stockItemId: string;
  itemType: StockItemType;
  qtyRequired: number;
  uom: string;
}

export interface BomTemplate {
  woType: string;
  description: string;
  items: BomTemplateItem[];
}

export const BOM_TEMPLATES: Record<string, BomTemplate> = {
  "Installation": {
    woType: "Installation",
    description: "Standard broadband installation",
    items: [
      { stockItemId: "SI-001", itemType: "serialized", qtyRequired: 1, uom: "pcs" },
      { stockItemId: "SI-003", itemType: "serialized", qtyRequired: 1, uom: "pcs" },
      { stockItemId: "SI-004", itemType: "cable", qtyRequired: 30, uom: "meters" },
      { stockItemId: "SI-006", itemType: "consumable", qtyRequired: 2, uom: "pcs" },
      { stockItemId: "SI-007", itemType: "consumable", qtyRequired: 10, uom: "pcs" },
      { stockItemId: "SI-010", itemType: "consumable", qtyRequired: 1, uom: "pcs" },
    ],
  },
  "Maintenance": {
    woType: "Maintenance",
    description: "Standard maintenance visit",
    items: [
      { stockItemId: "SI-001", itemType: "serialized", qtyRequired: 1, uom: "pcs" },
      { stockItemId: "SI-006", itemType: "consumable", qtyRequired: 4, uom: "pcs" },
      { stockItemId: "SI-007", itemType: "consumable", qtyRequired: 5, uom: "pcs" },
    ],
  },
  "Enterprise Installation": {
    woType: "Enterprise Installation",
    description: "Enterprise-grade installation with multiple devices",
    items: [
      { stockItemId: "SI-001", itemType: "serialized", qtyRequired: 4, uom: "pcs" },
      { stockItemId: "SI-003", itemType: "serialized", qtyRequired: 4, uom: "pcs" },
      { stockItemId: "SI-004", itemType: "cable", qtyRequired: 200, uom: "meters" },
      { stockItemId: "SI-006", itemType: "consumable", qtyRequired: 8, uom: "pcs" },
      { stockItemId: "SI-007", itemType: "consumable", qtyRequired: 40, uom: "pcs" },
      { stockItemId: "SI-010", itemType: "consumable", qtyRequired: 4, uom: "pcs" },
    ],
  },
  "Termination": {
    woType: "Termination",
    description: "Service termination and device retrieval",
    items: [],
  },
};

export const WO_TYPE_OPTIONS = Object.keys(BOM_TEMPLATES);
