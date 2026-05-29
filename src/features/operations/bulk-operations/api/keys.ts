import type { BulkOperationParams } from "../types";

export const BULK_OPERATION_KEYS = {
  all: () => ["BULK_OPERATION"],
  root: () => ["BULK_OPERATION"],
  list: (args?: BulkOperationParams) => [...BULK_OPERATION_KEYS.all(), "LIST", { ...(args || {}) }],
  detail: (id: string) => [...BULK_OPERATION_KEYS.all(), "DETAIL", id],
  plans: () => [...BULK_OPERATION_KEYS.all(), "PLANS"],
};
