import { useQuery } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  ActivityLog,
  ComplianceParams,
  ComplianceUserAccess,
  ListActivityLogsParams,
  ListLoginHistoriesParams,
  LoginHistory,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listLoginHistories = (params?: ListLoginHistoriesParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<LoginHistory[]>>(
    `${base}/login-histories`,
    { params },
  );

export const listActivityLogs = (params?: ListActivityLogsParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<ActivityLog[]>>(
    `${base}/activity-logs`,
    { params },
  );

export const complianceUsersAccess = (params: ComplianceParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<ComplianceUserAccess[]>>(
    `${base}/compliance/users-access`,
    {
      params: {
        permission: params.permission,
        page: params.page,
        per_page: params.per_page,
      },
    },
  );

export const useLoginHistories = (params?: ListLoginHistoriesParams) =>
  useQuery({
    queryKey: userServiceKeys.loginHistories(params),
    queryFn: () => listLoginHistories(params),
  });

export const useActivityLogs = (params?: ListActivityLogsParams) =>
  useQuery({
    queryKey: userServiceKeys.activityLogs(params),
    queryFn: () => listActivityLogs(params),
  });

export const useComplianceUsersAccess = (params: ComplianceParams) =>
  useQuery({
    queryKey: userServiceKeys.complianceUsersAccess(params),
    queryFn: () => complianceUsersAccess(params),
    enabled: !!params.permission,
  });
