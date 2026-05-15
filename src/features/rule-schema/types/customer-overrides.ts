import type { SchemaPaginationMeta } from "./index";

export interface CustomerSchema {
  id: string;
  customer_id: string;
  schema_type: string;
  schema_id: string;
  schema_version_id: string;
  original_content: Record<string, unknown>;
  overridden_content: Record<string, unknown>;
  rule: string;
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
  page?: number;
  size?: number;
  orderBy?: string;
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
