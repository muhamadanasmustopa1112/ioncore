import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { services } from "@/config/constants";
import { RBAC_PERMISSION_SEED } from "@/config/rbac-permission-seed";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  CreatePermissionRequest,
  PaginationParams,
  Permission,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listPermissions = (params?: PaginationParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<Permission[]>>(
    `${base}/permissions`,
    { params },
  );

export const createPermission = (payload: CreatePermissionRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Permission>>(
    `${base}/permissions`,
    payload,
  );

export interface BulkCreatePermissionResult {
  payload: CreatePermissionRequest;
  status: "created" | "skipped" | "failed";
  permission?: Permission;
  message?: string;
}

function isDuplicatePermissionError(err: unknown): boolean {
  if (!isAxiosError(err)) return false;
  const status = err.response?.status;
  const message = String(
    err.response?.data?.message ?? err.response?.data?.error ?? "",
  ).toLowerCase();
  return status === 409 || message.includes("already") || message.includes("duplicate");
}

export async function bulkCreatePermissions(
  payloads: CreatePermissionRequest[],
): Promise<BulkCreatePermissionResult[]> {
  const results: BulkCreatePermissionResult[] = [];

  for (const payload of payloads) {
    try {
      const resp = await createPermission(payload);
      results.push({
        payload,
        status: "created",
        permission: resp.data,
      });
    } catch (err) {
      if (isDuplicatePermissionError(err)) {
        results.push({
          payload,
          status: "skipped",
          message: "Permission already exists",
        });
        continue;
      }
      results.push({
        payload,
        status: "failed",
        message: isAxiosError(err)
          ? String(err.response?.data?.message ?? err.message)
          : "Failed to create permission",
      });
    }
  }

  return results;
}

export interface SeedRbacPermissionsResult {
  total: number;
  created: number;
  skipped: number;
  failed: number;
  results: BulkCreatePermissionResult[];
}

export async function seedRbacPermissions(): Promise<SeedRbacPermissionsResult> {
  const existingResp = await listPermissions({ per_page: 500 });
  const existingNames = new Set(
    (existingResp.data ?? []).map((p) => (p.name ?? "").trim().toLowerCase()),
  );

  const pending = RBAC_PERMISSION_SEED.filter(
    (seed) => !existingNames.has(seed.name.trim().toLowerCase()),
  );

  const results = await bulkCreatePermissions(pending);

  return {
    total: RBAC_PERMISSION_SEED.length,
    created: results.filter((r) => r.status === "created").length,
    skipped:
      results.filter((r) => r.status === "skipped").length +
      (RBAC_PERMISSION_SEED.length - pending.length),
    failed: results.filter((r) => r.status === "failed").length,
    results,
  };
}

export const usePermissions = (params?: PaginationParams) =>
  useQuery({
    queryKey: userServiceKeys.permissions(params),
    queryFn: () => listPermissions(params),
  });

export const useCreatePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePermissionRequest) => createPermission(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userServiceKeys.all }),
  });
};

export const useSeedRbacPermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => seedRbacPermissions(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userServiceKeys.all }),
  });
};
