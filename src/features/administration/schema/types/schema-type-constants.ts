export const SCHEMA_TYPE_OPTIONS = [
  { value: "BILLING", label: "Billing" },
  { value: "ONBOARDING", label: "Onboarding" },
  { value: "SERVICE", label: "Service" },
  { value: "COMMISSION", label: "Commission" },
  { value: "SUSPENSION", label: "Suspension" },
  { value: "WORK_ORDER", label: "Work Order" },
] as const;

export type SchemaTypeValue = (typeof SCHEMA_TYPE_OPTIONS)[number]["value"];

/** Uppercase API value → display label */
export const SCHEMA_TYPE_LABEL: Record<string, string> = Object.fromEntries(
  SCHEMA_TYPE_OPTIONS.map(({ value, label }) => [value, label])
);

/** Lowercase key → uppercase API value (for legacy callers in schema-api.ts) */
export const SCHEMA_TYPE_API: Record<string, string> = Object.fromEntries(
  SCHEMA_TYPE_OPTIONS.map(({ value }) => [value.toLowerCase(), value])
);
