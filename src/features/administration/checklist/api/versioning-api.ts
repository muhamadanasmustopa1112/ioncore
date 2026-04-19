import { api } from "@/lib/api-client";
import type { SchemaVersionDto, VersionListResponse, VersionDiffResponse } from "../types/versioning-api";

const BASE = "/administration/wo-checklist-templates";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export function listVersions(templateId: string) {
  return cast<ApiResponse<VersionListResponse>>(api.get(`${BASE}/${templateId}/versions`));
}

export function submitForApproval(templateId: string, versionId: string, changeReason: string) {
  return cast<ApiResponse<SchemaVersionDto>>(
    api.post(`${BASE}/${templateId}/versions/${versionId}/submit-for-approval`, { change_reason: changeReason })
  );
}

export function approveVersion(templateId: string, versionId: string, notes?: string) {
  return cast<ApiResponse<SchemaVersionDto>>(
    api.post(`${BASE}/${templateId}/versions/${versionId}/approve`, { notes })
  );
}

export function rejectVersion(templateId: string, versionId: string, reason: string) {
  return cast<ApiResponse<SchemaVersionDto>>(
    api.post(`${BASE}/${templateId}/versions/${versionId}/reject`, { rejection_reason: reason })
  );
}

export function publishVersion(templateId: string, versionId: string, changeReason: string) {
  return cast<ApiResponse<SchemaVersionDto>>(
    api.post(`${BASE}/${templateId}/versions/${versionId}/publish`, { change_reason: changeReason })
  );
}

export function archiveVersion(templateId: string, versionId: string) {
  return cast<ApiResponse<SchemaVersionDto>>(api.post(`${BASE}/${templateId}/versions/${versionId}/archive`));
}

export function cloneVersionAsDraft(templateId: string, versionId: string) {
  return cast<ApiResponse<SchemaVersionDto>>(api.post(`${BASE}/${templateId}/versions/${versionId}/clone-as-draft`));
}

export function getVersionDiff(templateId: string, v1: string, v2: string) {
  return cast<ApiResponse<VersionDiffResponse>>(api.get(`${BASE}/${templateId}/versions/${v1}/diff/${v2}`));
}
