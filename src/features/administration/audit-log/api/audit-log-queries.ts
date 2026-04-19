import { useQuery } from "@tanstack/react-query";
import type { AuditLog } from "../types/audit-log";
import type { AuditLogDto, AuditLogFilters } from "../types/audit-log-api";
import { listAuditLogs, getAuditLog } from "./audit-log-api";

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  list: (filters: AuditLogFilters) => [...auditLogKeys.all, "list", filters] as const,
  detail: (id: string) => [...auditLogKeys.all, "detail", id] as const,
};

function mapToAuditLog(dto: AuditLogDto): AuditLog {
  return {
    id: dto.id,
    timestamp: dto.timestamp,
    userId: dto.user_id,
    userName: dto.user_name,
    userEmail: dto.user_email,
    userRole: dto.user_role,
    actionType: dto.action_type,
    module: dto.module,
    section: dto.section,
    recordType: dto.record_type,
    recordId: dto.record_id,
    recordIdentifier: dto.record_identifier,
    before: dto.before,
    after: dto.after,
    changeReason: dto.change_reason,
    ipAddress: dto.ip_address,
    sessionId: dto.session_id,
    status: dto.status,
    errorMessage: dto.error_message,
  };
}

export function useAuditLogList(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: async () => {
      const res = await listAuditLogs(filters);
      const items = res.data?.audit_logs ?? [];
      return {
        logs: items.map(mapToAuditLog),
        pagination: res.data?.pagination ?? { page: 1, per_page: 20, total: 0, total_pages: 0 },
      };
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useAuditLogDetail(logId: string) {
  return useQuery({
    queryKey: auditLogKeys.detail(logId),
    queryFn: async () => {
      const res = await getAuditLog(logId);
      if (!res.data) return null;
      return mapToAuditLog(res.data);
    },
    enabled: !!logId,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}
