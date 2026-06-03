import type { VendorListParams } from "../types/vendor";

export const VENDOR_KEYS = {
  all: () => ["VENDORS"] as const,
  root: () => ["VENDORS"] as const,
  list: (args?: VendorListParams) => ["VENDORS", "LIST", args || {}] as const,
  detail: (id: string) => ["VENDORS", "DETAIL", id] as const,
  create: () => ["VENDORS", "CREATE"] as const,
  update: (id: string) => ["VENDORS", "UPDATE", id] as const,
  delete: (id: string) => ["VENDORS", "DELETE", id] as const,
};
