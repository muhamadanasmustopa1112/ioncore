import type { IcPoListParams } from "../types/ic-po";

export const IC_PO_KEYS = {
  all: () => ["IC_POS"] as const,
  root: () => ["IC_POS"] as const,
  list: (args?: IcPoListParams) => ["IC_POS", "LIST", args || {}] as const,
  detail: (id: string) => ["IC_POS", "DETAIL", id] as const,
  create: () => ["IC_POS", "CREATE"] as const,
  update: (id: string) => ["IC_POS", "UPDATE", id] as const,
  delete: (id: string) => ["IC_POS", "DELETE", id] as const,
};
