// Response envelope for Go user-service
export interface UserServiceEnvelope<T> {
  status?: "Success" | "Error" | string;
  message?: string;
  data: T;
  metadata?: PaginationMetadata;
  errors?: Record<string, string[]>;
}

export interface PaginationMetadata {
  page?: number;
  per_page?: number;
  total?: number;
  total_page?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

// ── Auth ───────────────────────────────────────────────
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_at?: string;
  refresh_expires_at?: string;
}

export interface AuthSession {
  id: string;
  user_id?: string;
  active_branch_id?: string | null;
  created_at?: string;
  expires_at?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  job_title?: string | null;
  function_name?: string | null;
  unit_kerja?: string | null;
  working_scope?: string | null;
  is_active?: boolean;
  is_locked?: boolean;
  force_password_change?: boolean;
  home_branch_id?: string | null;
  active_branch_id?: string | null;
  branches?: BranchRef[];
  roles?: RoleRef[];
  permissions?: PermissionRef[];
  created_at?: string;
  updated_at?: string;
}

export interface BranchRef {
  id: string;
  code?: string;
  name?: string;
  level?: string;
  type?: string;
}

export interface RoleRef {
  id: string;
  name: string;
  description?: string;
}

export interface PermissionRef {
  id: string;
  name: string;
  resource?: string;
  action?: string;
  description?: string;
}

export interface AuthPayload {
  tokens: AuthTokens;
  session: AuthSession;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface UpdateOwnProfileRequest {
  name?: string;
  phone?: string;
  job_title?: string;
  function_name?: string;
  unit_kerja?: string;
  working_scope?: string;
}

export interface SetActiveBranchRequest {
  branch_id: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

// ── Users admin ────────────────────────────────────────
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  job_title?: string;
  function_name?: string;
  unit_kerja?: string;
  working_scope?: string;
  role_ids?: string[];
  branch_ids?: string[];
  home_branch_id?: string;
  active_branch_id?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  job_title?: string;
  function_name?: string;
  unit_kerja?: string;
  working_scope?: string;
  sales_type?: string;
  employee_id?: string;
  technician_id?: string;
  reports_to_user_id?: string;
  home_branch_id?: string;
  active_branch_id?: string;
  branch_ids?: string[];
}

export interface UpdateUserStatusRequest {
  is_active?: boolean;
  is_locked?: boolean;
  force_password_change?: boolean;
}

export interface AdminResetPasswordRequest {
  new_password: string;
  force_password_change?: boolean;
}

export interface AssignRolesRequest {
  role_ids: string[];
}

export interface AssignBranchesRequest {
  branch_ids: string[];
  home_branch_id?: string;
}

export interface ListUsersParams extends PaginationParams {
  branch_id?: string;
}

// ── Sessions ───────────────────────────────────────────
export interface SessionItem {
  id: string;
  user_id: string;
  active_branch_id?: string | null;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
  expires_at?: string;
  revoked_at?: string | null;
  is_active?: boolean;
}

export interface ListSessionsParams extends PaginationParams {
  active_only?: boolean;
}

// ── Roles ──────────────────────────────────────────────
export interface Role extends RoleRef {
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

// ── Permissions ────────────────────────────────────────
export interface Permission extends PermissionRef {
  created_at?: string;
}

export interface CreatePermissionRequest {
  name?: string;
  resource: string;
  action: string;
  description?: string;
}

// ── Access policies ────────────────────────────────────
export interface AccessPolicy {
  id?: string;
  role?: RoleRef;
  permission?: PermissionRef;
  effect: "allow" | "deny";
  created_at?: string;
}

export interface CreateAccessPolicyRequest {
  role_id: string;
  permission_id: string;
  effect: "allow" | "deny";
}

// ── Branches ───────────────────────────────────────────
export interface Branch {
  id: string;
  code: string;
  name: string;
  level: string;
  type?: string;
  branch_parent_id?: string | null;
  region?: string;
  area?: string;
  sub_area?: string;
  segment?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBranchRequest {
  code: string;
  name: string;
  level: string;
  type?: string;
  branch_parent_id?: string | null;
  region?: string;
  area?: string;
  sub_area?: string;
  segment?: string;
  is_active?: boolean;
}

// ── Audit ──────────────────────────────────────────────
export interface LoginHistory {
  id: string;
  user_id: string;
  email?: string;
  ip_address?: string;
  user_agent?: string;
  success?: boolean;
  reason?: string;
  created_at?: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  category?: string;
  action?: string;
  resource?: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  is_suspicious?: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface ListActivityLogsParams extends PaginationParams {
  user_id?: string;
  category?: string;
  suspicious_only?: boolean;
}

export interface ListLoginHistoriesParams extends PaginationParams {
  user_id?: string;
}

export interface ComplianceUserAccess {
  user_id: string;
  name?: string;
  email?: string;
  branch_id?: string;
  role_name?: string;
}

export interface ComplianceParams extends PaginationParams {
  permission: string;
}
