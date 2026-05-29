import type { SlaMetricKey } from "../types";

export const SLA_KEYS = {
  all: () => ["SLA"] as const,
  dashboard: () => [...SLA_KEYS.all(), "DASHBOARD"] as const,
  drilldown: (metricKey: SlaMetricKey) =>
    [...SLA_KEYS.all(), "DRILLDOWN", metricKey] as const,
};
