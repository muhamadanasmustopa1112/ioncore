import type { SchemaPaginationMeta } from "./index";

export interface CustomerSchema {
  id: string;
  customer_id: string;
  customer_name?: string;
  schema_type: string;
  schema_id: string;
  schema_name?: string;
  schema_version?: string;
  schema_version_id: string;
  original_content: Record<string, unknown>;
  overridden_content: Record<string, unknown>;
  rule: string;
  is_overridden: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface CustomerSchemaListData {
  customer_schemas: CustomerSchema[];
  metadata: SchemaPaginationMeta;
}

export interface ListCustomerSchemasParams {
  customer_id?: string;
  schema_type?: string;
  schema_version_id?: string;
  page?: number;
  size?: number;
  orderBy?: string;
}

export interface MigrateCustomerSchemasRequest {
  original_schema_version_id: string;
  new_schema_version_id: string;
}

export interface CreateCustomerSchemaRequest {
  customer_id: string;
  schema_id: string;
  schema_type: string;
  schema_version_id: string;
  original_content?: Record<string, unknown>;
}

export interface UpdateCustomerSchemaRequest {
  overridden_content: Record<string, unknown>;
}

export interface ContentDiffOp {
  op: "replace" | "add" | "remove" | string;
  path: string;
  value: unknown;
  old_value?: unknown;
}

export interface ContentDiff {
  customer_schema_id: string;
  diff: ContentDiffOp[];
}

export interface CustomerGrouped {
  customer_id: string;
  customer_name: string;
  customer_schemas: CustomerSchema[];
  customer_schema_count: number;
}

export interface ListCustomerSchemasGroupedParams {
  search?: string;
  page?: number;
  size?: number;
}

// Legacy aliases
/** @deprecated use CustomerSchema */
export type CustomerOverrideSchema = CustomerSchema;
/** @deprecated use CustomerSchemaListData */
export type CustomerOverrideListData = CustomerSchemaListData;
/** @deprecated use ListCustomerSchemasParams */
export type ListCustomerOverridesParams = ListCustomerSchemasParams;
/** @deprecated use CreateCustomerSchemaRequest */
export type CreateCustomerOverrideRequest = CreateCustomerSchemaRequest;
/** @deprecated use UpdateCustomerSchemaRequest */
export type UpdateCustomerOverrideRequest = UpdateCustomerSchemaRequest;
