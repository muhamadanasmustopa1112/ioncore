export const userServiceKeys = {
  all: ["user-service"] as const,

  me: () => [...userServiceKeys.all, "me"] as const,
  mySessions: (params?: unknown) =>
    [...userServiceKeys.all, "me", "sessions", params] as const,
  myLoginHistories: (params?: unknown) =>
    [...userServiceKeys.all, "me", "login-histories", params] as const,
  myActivityLogs: (params?: unknown) =>
    [...userServiceKeys.all, "me", "activity-logs", params] as const,

  users: (params?: unknown) =>
    [...userServiceKeys.all, "users", params] as const,
  userSessions: (userId: string, params?: unknown) =>
    [...userServiceKeys.all, "users", userId, "sessions", params] as const,

  roles: (params?: unknown) =>
    [...userServiceKeys.all, "roles", params] as const,
  permissions: (params?: unknown) =>
    [...userServiceKeys.all, "permissions", params] as const,
  accessPolicies: (params?: unknown) =>
    [...userServiceKeys.all, "access-policies", params] as const,

  branches: (params?: unknown) =>
    [...userServiceKeys.all, "branches", params] as const,

  loginHistories: (params?: unknown) =>
    [...userServiceKeys.all, "login-histories", params] as const,
  activityLogs: (params?: unknown) =>
    [...userServiceKeys.all, "activity-logs", params] as const,
  complianceUsersAccess: (params?: unknown) =>
    [...userServiceKeys.all, "compliance", "users-access", params] as const,
};
