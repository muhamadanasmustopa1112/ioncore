import type { SchemaPaginationMeta } from "./index";

export interface CustomerSchema {
  id: string;
  customer_id: string;
  schema_id: string;
  schema_type: string;
  schema_version_id: string;
  original_content: string;
  overridden_content: string;
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
  original_content?: number[];
}

export interface UpdateCustomerSchemaRequest {
  schema_id?: string;
  schema_type?: string;
  schema_version_id?: string;
  overridden_content?: number[];
  rule?: string;
}

// Legacy aliases — remove after components fully migrated
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
