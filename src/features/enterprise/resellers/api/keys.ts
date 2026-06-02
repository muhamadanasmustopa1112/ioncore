import type { ResellerListParams } from "../types/reseller";

export const RESELLER_KEYS = {
  all: () => ["RESELLERS"] as const,
  root: () => ["RESELLERS"] as const,
  list: (args?: ResellerListParams) => ["RESELLERS", "LIST", args || {}] as const,
  detail: (id: string) => ["RESELLERS", "DETAIL", id] as const,
  create: () => ["RESELLERS", "CREATE"] as const,
  update: (id: string) => ["RESELLERS", "UPDATE", id] as const,
  delete: (id: string) => ["RESELLERS", "DELETE", id] as const,
};
