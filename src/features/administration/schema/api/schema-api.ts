import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { SchemaRecord, SchemaVersion } from "../types";
import { SCHEMA_TYPE_API } from "../types/schema-type-constants";

const BASE = `${services.ruleScheme}/schemas`;
const VERSIONS_BASE = `${services.ruleScheme}/schema-versions`;
const APPROVALS_BASE = `${services.ruleScheme}/schema-version-approvals`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export interface RuleSchemaEnvelope<T> {
  data: T;
  error: string | null;
  message: string;
  metadata: { page: number; size: number; total: number } | null;
}

export interface SchemaListData {
  schemas: SchemaRecord[];
  metadata: { page: number; size: number; total: number };
}

export interface SchemaVersionListData {
  schema_versions: SchemaVersion[];
  metadata: { page: number; size: number; total: number };
}

export interface SchemaListParams {
  page?: number;
  size?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  schemaType?: string;
  hasSchemaPublished?: boolean;
}

export interface CreateSchemaPayload {
  schema_type: string;
  name: string;
  customer_type: string;
  schema_mode_type?: string;
  change_reason?: string;
  content: object;
}

export interface UpdateSchemaContentPayload {
  content: object;
  change_reason?: string;
}

export interface CreateVersionPayload {
  version: string;
  change_reason: string;
  content: object;
  approval?: { min_approvals: number };
}

export interface UpdateVersionPayload {
  version?: string;
  status?: string;
  change_reason?: string;
  content?: object;
}

export interface CloneVersionPayload {
  name: string;
  clone_reason?: string;
}

export interface RollbackPayload {
  version: string;
  target_version: string;
}

export interface SchemaApprovalRecord {
  id: string;
  schema_version_id: string;
  required_approvers: string;
  min_approvals: number;
  status: string;
  approved_at: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface SchemaApprovalDecisionRecord {
  id: string;
  schema_approval_id: string;
  approver_user_id: string;
  decision: "APPROVED" | "REJECTED" | "PENDING";
  comment: string;
  decided_at: string;
  created_at: string;
  updated_at: string;
}

export interface SchemaApprovalDecisionListData {
  decisions: SchemaApprovalDecisionRecord[];
  metadata: { page: number; size: number; total: number };
}

export interface SubmitForReviewPayload {
  required_approvers?: string;
  min_approvals: number;
}

export interface AddDecisionPayload {
  decision: "APPROVED" | "REJECTED" | "PENDING";
  notes?: string;
}

function toApiSchemaType(type: string): string {
  return SCHEMA_TYPE_API[type] ?? type;
}

export function listSchemas(params: SchemaListParams = {}) {
  return cast<RuleSchemaEnvelope<SchemaListData>>(
    userServiceApi.get(`${BASE}/`, {
      params: {
        ...params,
        ...(params.schemaType ? { schemaType: toApiSchemaType(params.schemaType) } : {}),
      },
    })
  );
}

export function getSchema(id: string) {
  return cast<RuleSchemaEnvelope<SchemaRecord>>(
    userServiceApi.get(`${BASE}/${id}`)
  );
}

export function createSchema(payload: CreateSchemaPayload) {
  return cast<RuleSchemaEnvelope<SchemaRecord>>(
    userServiceApi.post(BASE, {
      ...payload,
      schema_type: toApiSchemaType(payload.schema_type),
      schema_mode_type: payload.schema_mode_type ?? "default",
    })
  );
}

export function updateSchemaContent(id: string, payload: UpdateSchemaContentPayload) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.put(`${BASE}/${id}/content`, payload)
  );
}

export function getSchemaTypes() {
  return cast<RuleSchemaEnvelope<string[]>>(
    userServiceApi.get(`${BASE}/types`)
  );
}

export function listSchemaVersions(id: string) {
  return cast<RuleSchemaEnvelope<SchemaVersionListData>>(
    userServiceApi.get(`${BASE}/${id}/versions`)
  );
}

export function getSchemaVersion(versionId: string) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.get(`${VERSIONS_BASE}/${versionId}`)
  );
}

export function createSchemaVersion(id: string, payload: CreateVersionPayload) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.post(`${BASE}/${id}/versions`, payload)
  );
}

export function updateSchemaVersion(versionId: string, payload: UpdateVersionPayload) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.put(`${VERSIONS_BASE}/${versionId}`, payload)
  );
}

export function publishSchemaVersion(versionId: string) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.put(`${VERSIONS_BASE}/${versionId}/publish`)
  );
}

export function cloneSchemaVersion(versionId: string, payload: CloneVersionPayload) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.post(`${VERSIONS_BASE}/${versionId}/clone`, payload)
  );
}

export function getSchemaVersionDiff(id: string, version: string, target_version: string) {
  return cast<RuleSchemaEnvelope<Record<string, unknown>>>(
    userServiceApi.get(`${BASE}/${id}/versions/diff`, {
      params: { version, target_version },
    })
  );
}

export function rollbackSchemaVersion(id: string, payload: RollbackPayload) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.put(`${BASE}/${id}/versions/rollback`, payload)
  );
}

export function evaluateSchemaVersion(versionId: string, data: object) {
  return cast<RuleSchemaEnvelope<Record<string, unknown>>>(
    userServiceApi.post(`${VERSIONS_BASE}/${versionId}/evaluate`, {
      schema_version_id: versionId,
      data: JSON.stringify(data),
    })
  );
}

export function getSchemaVersionByVersionString(schemaId: string, version: string) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.get(`${BASE}/${schemaId}/versions/${version}`)
  );
}

export function submitForReview(versionId: string, payload: SubmitForReviewPayload) {
  return cast<RuleSchemaEnvelope<SchemaVersion>>(
    userServiceApi.put(`${VERSIONS_BASE}/${versionId}/review`, payload)
  );
}

export function addApprovalDecision(versionId: string, payload: AddDecisionPayload) {
  return cast<RuleSchemaEnvelope<SchemaApprovalDecisionRecord>>(
    userServiceApi.post(`${VERSIONS_BASE}/${versionId}/decisions`, payload)
  );
}

export function getVersionApproval(versionId: string) {
  return cast<RuleSchemaEnvelope<SchemaApprovalRecord>>(
    userServiceApi.get(`${VERSIONS_BASE}/${versionId}/approval`)
  );
}

export function listApprovalDecisions(approvalId: string) {
  return cast<RuleSchemaEnvelope<SchemaApprovalDecisionListData>>(
    userServiceApi.get(`${APPROVALS_BASE}/${approvalId}/decisions`, {
      params: { page: 1, size: 50 },
    })
  );
}
