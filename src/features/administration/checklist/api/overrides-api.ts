import { api } from "@/lib/api-client";
import type { OverrideDto, OverrideListResponse, OverridePayload } from "../types/overrides-api";

const BASE = "/administration/wo-execution-overrides";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export function listOverrides(params?: { status?: string; page?: number; limit?: number }) {
  return cast<ApiResponse<OverrideListResponse>>(api.get(BASE, { params }));
}

export function getOverride(id: string) {
  return cast<ApiResponse<OverrideDto>>(api.get(`${BASE}/${id}`));
}

export function createOverride(payload: OverridePayload) {
  return cast<ApiResponse<OverrideDto>>(api.post(BASE, payload));
}

export function updateOverride(id: string, payload: Partial<OverridePayload>) {
  return cast<ApiResponse<OverrideDto>>(api.patch(`${BASE}/${id}`, payload));
}

export function deleteOverride(id: string) {
  return cast<ApiResponse<null>>(api.delete(`${BASE}/${id}`));
}

export function approveOverride(id: string) {
  return cast<ApiResponse<OverrideDto>>(api.post(`${BASE}/${id}/approve`));
}

export function archiveOverride(id: string) {
  return cast<ApiResponse<OverrideDto>>(api.post(`${BASE}/${id}/archive`));
}
