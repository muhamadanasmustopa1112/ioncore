import type { PreBoqListParams, RfqListParams, BoqListParams, QuotationListParams } from "../types/cpq";

export const CPQ_KEYS = {
  all: () => ["CPQ"] as const,
  preBoqs: (args?: PreBoqListParams) => ["CPQ", "PRE_BOQS", args || {}] as const,
  rfqs: (args?: RfqListParams) => ["CPQ", "RFQS", args || {}] as const,
  boqs: (args?: BoqListParams) => ["CPQ", "BOQS", args || {}] as const,
  quotations: (args?: QuotationListParams) => ["CPQ", "QUOTATIONS", args || {}] as const,
};
