import { useQuery } from "@tanstack/react-query";
import { listActivityLogs } from "@/features/user-service/api/audit";
import { getPageCount, getTotal, getPerPage } from "@/lib/pagination";
import type { ActivityLog } from "@/features/user-service/types";
import type { AuditLog } from "../types/audit-log";
import type { AuditLogFilters } from "../types/audit-log-api";

export const auditLogKeys = {
  all: ["audit-logs"] as const,
  list: (filters: Partial<AuditLogFilters>) => [...auditLogKeys.all, "list", filters] as const,
  detail: (id: string) => [...auditLogKeys.all, "detail", id] as const,
};

function mapActivityLog(log: ActivityLog): AuditLog {
  return {
    id: log.id,
    timestamp: log.created_at || new Date().toISOString(),
    userId: log.user_id,
    userName: log.user_id,
    userEmail: "",
    userRole: "",
    actionType: (log.action || "update") as AuditLog["actionType"],
    module: (log.category || "user") as AuditLog["module"],
    section: "",
    recordType: log.resource || "",
    recordId: log.resource_id || "",
    recordIdentifier: [log.resource, log.resource_id].filter(Boolean).join("/"),
    before: null,
    after: log.metadata ?? null,
    changeReason: null,
    ipAddress: log.ip_address || null,
    sessionId: null,
    status: log.is_suspicious ? "partial" : "success",
    errorMessage: null,
  };
}

export function useAuditLogList(filters: Partial<AuditLogFilters> = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: async () => {
      const res = await listActivityLogs({
        page: filters.page ?? 1,
        per_page: filters.per_page ?? 20,
        category: filters.module?.[0],
        user_id: filters.user_id?.[0],
      });
      const items = Array.isArray(res.data) ? res.data : [];
      const perPage = getPerPage(res.metadata, filters.per_page ?? 20);
      const total = getTotal(res.metadata);
      const totalPages = getPageCount(res.metadata, perPage);
      return {
        logs: items.map(mapActivityLog),
        pagination: {
          page: res.metadata?.page ?? filters.page ?? 1,
          per_page: perPage,
          total,
          total_pages: totalPages || 1,
        },
      };
    },
    retry: false,
  });
}

export function useAuditLogDetail(logId: string) {
  return useQuery({
    queryKey: auditLogKeys.detail(logId),
    queryFn: async () => null as AuditLog | null,
    enabled: !!logId,
  });
}
