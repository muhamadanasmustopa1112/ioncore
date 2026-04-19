import type { ConfigCategory, ConfigDataType } from "./platform-config-api";

export type { ConfigCategory, ConfigDataType };

export interface PlatformConfig {
  key: string;
  value: unknown;
  configType: "global" | "per_branch";
  branchId: string | null;
  category: ConfigCategory;
  description: string;
  required: boolean;
  dataType: ConfigDataType;
  allowedValues: string[] | null;
  defaultValue: unknown;
  isSensitive: boolean;
  updatedAt: string;
  updatedBy: string | null;
}

export const CATEGORY_LABELS: Record<ConfigCategory, string> = {
  stock_warehouse: "Stock & Warehouse",
  network: "Network",
  payment_gateway: "Payment Gateway",
  integrations: "Integrations",
  tax_legal: "Tax & Legal",
  map_navigation: "Map & Navigation",
  general: "General",
  per_branch: "Per-Branch",
};

export const INTEGRATION_KEYS = [
  "ion_radius_api_endpoint",
  "hris_api_endpoint",
  "ocr_provider_endpoint",
];
