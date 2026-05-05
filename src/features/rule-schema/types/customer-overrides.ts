import type { SchemaPaginationMeta } from "./index";

export interface CustomerOverrideSchema {
  id: string;
  schema_id: string;
  schema_name: string;
  customer_id: string;
  customer_name: string;
  baseline_schema_id: string;
  baseline_schema_name: string;
  created_by: string;
  updated_by: string;
}

export interface CustomerOverrideListData {
  customer_override_schemas: CustomerOverrideSchema[];
  metadata: SchemaPaginationMeta;
}

export interface ListCustomerOverridesParams {
  schema_id?: string;
  customer_id?: string;
  page?: number;
  size?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface CreateCustomerOverrideRequest {
  schema_id: string;
  customer_id: string;
  customer_name: string;
}

export type UpdateCustomerOverrideRequest = CreateCustomerOverrideRequest;

export type OverrideDiffStatus = "Added" | "Removed" | "Changed" | string;

export interface OverriddenField {
  path: string;
  from?: string;
  to?: string;
  status: OverrideDiffStatus;
}

export interface OverrideContentDiff {
  schema_type: string;
  customer_id: string;
  baseline_label: string;
  override_label: string;
  baseline_schema_id: string;
  override_schema_id: string;
  baseline_version_name: string;
  override_version_name: string;
  baseline_schema_version_id: string;
  override_schema_version_id: string;
  overridden_fields: OverriddenField[];
}
