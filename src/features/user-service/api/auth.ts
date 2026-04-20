import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  AuthPayload,
  AuthUser,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ListActivityLogsParams,
  ListLoginHistoriesParams,
  ListSessionsParams,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SetActiveBranchRequest,
  UpdateOwnProfileRequest,
  UserServiceEnvelope,
  ActivityLog,
  LoginHistory,
  SessionItem,
} from "../types";

const base = services.user;

// ── Public ─────────────────────────────────────────────
export const register = (payload: RegisterRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthPayload>>(
    `${base}/auth/register`,
    payload,
  );

export const login = (payload: LoginRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthPayload>>(
    `${base}/auth/login`,
    payload,
  );

export const refreshSession = (payload: RefreshRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AuthPayload>>(
    `${base}/auth/refresh`,
    payload,
  );

export const forgotPassword = (payload: ForgotPasswordRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${base}/auth/forgot-password`,
    payload,
  );

export const resetPassword = (payload: ResetPasswordRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${base}/auth/reset-password`,
    payload,
  );

// ── Protected ──────────────────────────────────────────
export const logout = (payload: LogoutRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${base}/auth/logout`,
    payload,
  );

export const logoutAll = () =>
  userServiceApi.post<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${base}/auth/logout-all`,
  );

export const getMyProfile = () =>
  userServiceApi.get<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/auth/me`,
  );

export const updateMyProfile = (payload: UpdateOwnProfileRequest) =>
  userServiceApi.put<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/auth/me`,
    payload,
  );

export const changeMyPassword = (payload: ChangePasswordRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Record<string, unknown>>>(
    `${base}/auth/change-password`,
    payload,
  );

export const listMySessions = (params?: ListSessionsParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<SessionItem[]>>(
    `${base}/auth/sessions`,
    { params },
  );

export const setActiveBranch = (payload: SetActiveBranchRequest) =>
  userServiceApi.put<unknown, UserServiceEnvelope<AuthUser>>(
    `${base}/auth/active-branch`,
    payload,
  );

export const listMyLoginHistories = (params?: ListLoginHistoriesParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<LoginHistory[]>>(
    `${base}/auth/login-histories`,
    { params },
  );

export const listMyActivityLogs = (params?: ListActivityLogsParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<ActivityLog[]>>(
    `${base}/auth/activity-logs`,
    { params },
  );

// ── Hooks ──────────────────────────────────────────────
export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
  });

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
  });

export const useRefreshSession = () =>
  useMutation({
    mutationFn: (payload: RefreshRequest) => refreshSession(payload),
  });

export const useForgotPassword = () =>
  useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => forgotPassword(payload),
  });

export const useResetPassword = () =>
  useMutation({
    mutationFn: (payload: ResetPasswordRequest) => resetPassword(payload),
  });

export const useLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: LogoutRequest) => logout(payload),
    onSuccess: () => qc.clear(),
  });
};

export const useLogoutAll = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => logoutAll(),
    onSuccess: () => qc.clear(),
  });
};

export const useMyProfile = (enabled = true) =>
  useQuery({
    queryKey: userServiceKeys.me(),
    queryFn: () => getMyProfile(),
    enabled,
  });

export const useUpdateMyProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOwnProfileRequest) => updateMyProfile(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userServiceKeys.me() }),
  });
};

export const useChangeMyPassword = () =>
  useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changeMyPassword(payload),
  });

export const useMySessions = (params?: ListSessionsParams) =>
  useQuery({
    queryKey: userServiceKeys.mySessions(params),
    queryFn: () => listMySessions(params),
  });

export const useSetActiveBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetActiveBranchRequest) => setActiveBranch(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userServiceKeys.me() }),
  });
};

export const useMyLoginHistories = (params?: ListLoginHistoriesParams) =>
  useQuery({
    queryKey: userServiceKeys.myLoginHistories(params),
    queryFn: () => listMyLoginHistories(params),
  });

export const useMyActivityLogs = (params?: ListActivityLogsParams) =>
  useQuery({
    queryKey: userServiceKeys.myActivityLogs(params),
    queryFn: () => listMyActivityLogs(params),
  });
