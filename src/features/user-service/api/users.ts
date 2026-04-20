import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  AdminResetPasswordRequest,
  AssignBranchesRequest,
  AssignRolesRequest,
  AuthUser,
  CreateUserRequest,
  ListSessionsParams,
  ListUsersParams,
  SessionItem,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listUsers = (params?: ListUsersParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<AuthUser[]>>(
    `${base}/users`,
    { params },
  );

export const createUser = (payload: CreateUserRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/users`,
    payload,
  );

export const updateUser = (id: string, payload: UpdateUserRequest) =>
  userServiceApi.put<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/users/${id}`,
    payload,
  );

export const updateUserStatus = (
  id: string,
  payload: UpdateUserStatusRequest,
) =>
  userServiceApi.patch<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/users/${id}/status`,
    payload,
  );

export const adminResetUserPassword = (
  id: string,
  payload: AdminResetPasswordRequest,
) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/users/${id}/reset-password`,
    payload,
  );

export const assignUserRoles = (id: string, payload: AssignRolesRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/users/${id}/roles`,
    payload,
  );

export const assignUserBranches = (
  id: string,
  payload: AssignBranchesRequest,
) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/users/${id}/branches`,
    payload,
  );

export const listUserSessions = (id: string, params?: ListSessionsParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<SessionItem[]>>(
    `${base}/users/${id}/sessions`,
    { params },
  );

export const revokeUserSessions = (id: string) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${base}/users/${id}/sessions/revoke`,
  );

// ── Hooks ──────────────────────────────────────────────
export const useUsers = (params?: ListUsersParams) =>
  useQuery({
    queryKey: userServiceKeys.users(params),
    queryFn: () => listUsers(params),
  });

const invalidateUsers = (qc: ReturnType<typeof useQueryClient>) =>
  qc.invalidateQueries({ queryKey: userServiceKeys.all });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => createUser(payload),
    onSuccess: () => invalidateUsers(qc),
  });
};

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) =>
      updateUser(id, payload),
    onSuccess: () => invalidateUsers(qc),
  });
};

export const useUpdateUserStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserStatusRequest;
    }) => updateUserStatus(id, payload),
    onSuccess: () => invalidateUsers(qc),
  });
};

export const useAdminResetUserPassword = () =>
  useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminResetPasswordRequest;
    }) => adminResetUserPassword(id, payload),
  });

export const useAssignUserRoles = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignRolesRequest }) =>
      assignUserRoles(id, payload),
    onSuccess: () => invalidateUsers(qc),
  });
};

export const useAssignUserBranches = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AssignBranchesRequest;
    }) => assignUserBranches(id, payload),
    onSuccess: () => invalidateUsers(qc),
  });
};

export const useUserSessions = (id: string, params?: ListSessionsParams) =>
  useQuery({
    queryKey: userServiceKeys.userSessions(id, params),
    queryFn: () => listUserSessions(id, params),
    enabled: !!id,
  });

export const useRevokeUserSessions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => revokeUserSessions(id),
    onSuccess: () => invalidateUsers(qc),
  });
};
