import { api } from "@/lib/api-client";
import type {
  ConfigCategory,
  PlatformConfigDto,
  PlatformConfigListResponse,
  PlatformConfigUpdatePayload,
} from "../types/platform-config-api";

const BASE = "/administration/platform-config";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export function listPlatformConfigs(category?: ConfigCategory, branchId?: string) {
  const params: Record<string, string> = {};
  if (category) params.category = category;
  if (branchId) params.branch_id = branchId;
  return cast<ApiResponse<PlatformConfigListResponse>>(api.get(BASE, { params }));
}

export function getPlatformConfig(key: string) {
  return cast<ApiResponse<PlatformConfigDto>>(api.get(`${BASE}/${key}`));
}

export function updatePlatformConfig(key: string, payload: PlatformConfigUpdatePayload) {
  return cast<ApiResponse<PlatformConfigDto>>(api.patch(`${BASE}/${key}`, payload));
}

export function resetPlatformConfig(key: string) {
  return cast<ApiResponse<PlatformConfigDto>>(api.post(`${BASE}/${key}/reset`));
}

export function testConnection(key: string) {
  return cast<ApiResponse<{ latency_ms: number; status: "ok" | "error"; message: string }>>(
    api.post(`${BASE}/${key}/test-connection`)
  );
}
