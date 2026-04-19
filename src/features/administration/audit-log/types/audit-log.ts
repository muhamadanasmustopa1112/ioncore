import type { AuditActionType, AuditModule, AuditStatus } from "./audit-log-api";

export type { AuditActionType, AuditModule, AuditStatus };

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  actionType: AuditActionType;
  module: AuditModule;
  section: string;
  recordType: string;
  recordId: string;
  recordIdentifier: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  changeReason: string | null;
  ipAddress: string | null;
  sessionId: string | null;
  status: AuditStatus;
  errorMessage: string | null;
}

export interface AuditLogFilters {
  page: number;
  perPage: number;
  fromDate: string;
  toDate: string;
  userIds: string[];
  actionTypes: AuditActionType[];
  modules: AuditModule[];
  recordType: string;
  search: string;
}
