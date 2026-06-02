import type { EwoListParams } from "../types/ewo";

export const EWO_KEYS = {
  all: () => ["EWOS"] as const,
  root: () => ["EWOS"] as const,
  list: (args?: EwoListParams) => ["EWOS", "LIST", args || {}] as const,
  detail: (id: string) => ["EWOS", "DETAIL", id] as const,
  create: () => ["EWOS", "CREATE"] as const,
  update: (id: string) => ["EWOS", "UPDATE", id] as const,
  delete: (id: string) => ["EWOS", "DELETE", id] as const,
};
