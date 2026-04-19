import { api } from "@/lib/api-client";
import type {
  BindingListResponse,
  ChecklistBindingDto,
  ChecklistBindingPayload,
  ServiceChangePolicyDto,
  ServiceChangePolicyListResponse,
  ServiceChangePolicyPayload,
} from "../types/binding-api";

const BIND_BASE = "/administration/wo-checklist-bindings";
const POLICY_BASE = "/administration/service-change-policies";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export function listBindings() {
  return cast<ApiResponse<BindingListResponse>>(api.get(BIND_BASE));
}

export function createBinding(payload: ChecklistBindingPayload) {
  return cast<ApiResponse<ChecklistBindingDto>>(api.post(BIND_BASE, payload));
}

export function updateBinding(id: string, payload: Partial<ChecklistBindingPayload>) {
  return cast<ApiResponse<ChecklistBindingDto>>(api.patch(`${BIND_BASE}/${id}`, payload));
}

export function deleteBinding(id: string) {
  return cast<ApiResponse<null>>(api.delete(`${BIND_BASE}/${id}`));
}

export function listServiceChangePolicies() {
  return cast<ApiResponse<ServiceChangePolicyListResponse>>(api.get(POLICY_BASE));
}

export function createServiceChangePolicy(payload: ServiceChangePolicyPayload) {
  return cast<ApiResponse<ServiceChangePolicyDto>>(api.post(POLICY_BASE, payload));
}

export function updateServiceChangePolicy(id: string, payload: Partial<ServiceChangePolicyPayload>) {
  return cast<ApiResponse<ServiceChangePolicyDto>>(api.patch(`${POLICY_BASE}/${id}`, payload));
}

export function deleteServiceChangePolicy(id: string) {
  return cast<ApiResponse<null>>(api.delete(`${POLICY_BASE}/${id}`));
}
