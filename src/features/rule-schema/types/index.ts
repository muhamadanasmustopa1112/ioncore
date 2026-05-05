// Response envelope — differs from user-service (uses `error` not `status`/`errors`)
export interface RuleSchemaEnvelope<T> {
  data: T;
  error: string;
  message: string;
  metadata: null | SchemaPaginationMeta;
}

export interface SchemaPaginationMeta {
  page: number;
  size: number;
  total: number;
}

// ── Domain types ────────────────────────────────────────

export type SchemaType =
  | "billing"
  | "onboarding"
  | "service"
  | "commission"
  | "suspension"
  | string;

export type SchemaVersionStatus = "DRAFT" | "PUBLISHED" | string;

export interface Schema {
  id: string;
  schema_type: SchemaType;
  name: string;
  customer_type: string;
  schema_mode_type: string;
  latest_version: string;
  created_by: string;
  updated_by: string;
}

export interface SchemaVersion {
  id: string;
  schema_id: string;
  version: string;
  status: SchemaVersionStatus;
  change_reason: string;
  content: Record<string, unknown>;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  published_by: string;
}

export interface SchemaDiff {
  status: "~" | "+" | "-" | string;
  differences: string;
}

export interface EvaluateResult {
  schema_version_id: string;
  schema_type: string;
  result: string;
}

// ── Paginated response shapes ───────────────────────────

export interface SchemaListData {
  schemas: Schema[];
  metadata: SchemaPaginationMeta;
}

export interface SchemaVersionListData {
  schema_versions: SchemaVersion[];
  metadata: SchemaPaginationMeta;
}

export interface SchemaDiffData {
  schema_versions: SchemaDiff[];
}

// ── Request types ───────────────────────────────────────

export interface ListSchemasParams {
  page?: number;
  size?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  schemaType?: SchemaType;
}

export interface ListSchemaVersionsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface CreateSchemaRequest {
  schema_type: SchemaType;
  name: string;
  customer_type: string;
  schema_mode_type: string;
  change_reason?: string;
  content: Record<string, unknown>;
}

export interface UpdateSchemaContentRequest {
  change_reason: string;
  content: Record<string, unknown>;
}

export interface CreateSchemaVersionRequest {
  version: string;
  change_reason: string;
  content: Record<string, unknown>;
  approval?: {
    min_approvals: number;
    required_approvers?: string;
  };
}

export interface UpdateSchemaVersionRequest {
  version?: string;
  status?: string;
  change_reason: string;
  content: Record<string, unknown>;
}

export interface CloneSchemaVersionRequest {
  name: string;
  clone_reason: string;
}

export interface RollbackVersionRequest {
  version: string;
  target_version: string;
}

export interface DiffVersionsParams {
  version: string;
  target_version: string;
}

export interface EvaluateSchemaRequest {
  schema_version_id: string;
  data: string;
}

export * from "./customer-overrides";
