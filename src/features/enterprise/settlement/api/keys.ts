import type { SettlementListParams } from "../types/settlement";

export const SETTLEMENT_KEYS = {
  all: () => ["SETTLEMENTS"] as const,
  root: () => ["SETTLEMENTS"] as const,
  list: (args?: SettlementListParams) => ["SETTLEMENTS", "LIST", args || {}] as const,
  detail: (id: string) => ["SETTLEMENTS", "DETAIL", id] as const,
};
