export type SlaStatus = "green" | "yellow" | "red";

export type SlaTrend = "up" | "down" | "neutral";

export type SlaMetricKey =
  | "customer_service"
  | "wo_assignment"
  | "wo_completion"
  | "onboarding"
  | "billing"
  | "maintenance"
  | "enterprise_projects";

export type SlaDrilldownRecord = {
  id: string;
  wo_number?: string;
  customer_name?: string;
  area?: string;
  days_overdue?: number;
  status?: string;
  actions_available: boolean;
};

export type SlaMetric = {
  metric_key: SlaMetricKey;
  name: string;
  value: number | string;
  unit: string;
  status: SlaStatus;
  trend: SlaTrend;
  previous_value: number | null;
  drilldown_records: SlaDrilldownRecord[];
};

export type SlaDashboardResponse = {
  last_updated: string;
  metrics: Record<SlaMetricKey, SlaMetric>;
};
