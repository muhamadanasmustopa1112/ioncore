export const REPORT_KEYS = {
  all: () => ["REPORT"],
  root: () => ["REPORT"],
  kpi: () => [...REPORT_KEYS.all(), "KPI"],
  revenueTrend: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "REVENUE_TREND",
    { ...(args || {}) },
  ],
  arAging: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "AR_AGING",
    { ...(args || {}) },
  ],
  revenueByType: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "REVENUE_BY_TYPE",
    { ...(args || {}) },
  ],
  revenueByBranch: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "REVENUE_BY_BRANCH",
    { ...(args || {}) },
  ],
  suspensionTrend: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "SUSPENSION_TREND",
    { ...(args || {}) },
  ],
  commissionSummary: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "COMMISSION_SUMMARY",
    { ...(args || {}) },
  ],
  invoiceRegister: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "INVOICE_REGISTER",
    { ...(args || {}) },
  ],
  arAgingDetail: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "AR_AGING_DETAIL",
    { ...(args || {}) },
  ],
  fakturPajak: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "FAKTUR_PAJAK",
    { ...(args || {}) },
  ],
  suspensionList: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "SUSPENSION_LIST",
    { ...(args || {}) },
  ],
  commissionDetail: (args?: Record<string, unknown>) => [
    ...REPORT_KEYS.all(),
    "COMMISSION_DETAIL",
    { ...(args || {}) },
  ],
};
