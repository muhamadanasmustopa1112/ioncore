import { api } from "@/lib/api-client";
import type { AuditLogDto, AuditLogFilters, AuditLogListResponse } from "../types/audit-log-api";

const BASE = "/administration/audit-log";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export function listAuditLogs(filters: AuditLogFilters = {}) {
  const params: Record<string, unknown> = {
    page: filters.page ?? 1,
    per_page: filters.per_page ?? 20,
    sort: filters.sort ?? "-timestamp",
  };
  if (filters.from_date) params.from_date = filters.from_date;
  if (filters.to_date) params.to_date = filters.to_date;
  if (filters.user_id?.length) params["filter[user_id]"] = filters.user_id.join(",");
  if (filters.action_type?.length) params["filter[action_type]"] = filters.action_type.join(",");
  if (filters.module?.length) params["filter[module]"] = filters.module.join(",");
  if (filters.record_type) params["filter[record_type]"] = filters.record_type;
  if (filters.search) params.search = filters.search;

  return cast<ApiResponse<AuditLogListResponse>>(api.get(BASE, { params }));
}

export function getAuditLog(logId: string) {
  return cast<ApiResponse<AuditLogDto>>(api.get(`${BASE}/${logId}`));
}

export function getEntityAuditLogs(recordType: string, recordId: string) {
  return cast<ApiResponse<AuditLogListResponse>>(
    api.get(`${BASE}/entity/${recordType}/${recordId}`)
  );
}

export function exportAuditLogs(filters: AuditLogFilters, format: "csv" | "json" = "csv") {
  const params: Record<string, unknown> = { format, ...filters };
  return cast<Blob>(api.get(`${BASE}/export`, { params, responseType: "blob" }));
}
