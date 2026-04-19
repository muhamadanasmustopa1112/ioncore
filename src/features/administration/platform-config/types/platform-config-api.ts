export type ConfigCategory =
  | "stock_warehouse"
  | "network"
  | "payment_gateway"
  | "integrations"
  | "tax_legal"
  | "map_navigation"
  | "general"
  | "per_branch";

export type ConfigDataType = "string" | "number" | "boolean" | "json" | "enum";

export interface PlatformConfigDto {
  key: string;
  value: unknown;
  config_type: "global" | "per_branch";
  branch_id: string | null;
  category: ConfigCategory;
  description: string;
  required: boolean;
  data_type: ConfigDataType;
  allowed_values: string[] | null;
  default_value: unknown;
  is_sensitive: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface PlatformConfigUpdatePayload {
  value: unknown;
  branch_id?: string;
}

export interface PlatformConfigListResponse {
  configs: PlatformConfigDto[];
}
