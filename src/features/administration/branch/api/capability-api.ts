import { api } from "@/lib/api-client";
import {
  ApiResponse,
  CapabilityDto,
  CapabilityListResponse,
  CapabilityPayload,
} from "../types/capability-api";

const BASE = "/branch";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listCapabilities(branchId: string) {
  return cast<ApiResponse<CapabilityListResponse>>(
    api.get(`${BASE}/${branchId}/capability`)
  );
}

export function createCapability(branchId: string, payload: CapabilityPayload) {
  return cast<ApiResponse<CapabilityDto>>(
    api.post(`${BASE}/${branchId}/capability`, payload)
  );
}

export function updateCapability(
  branchId: string,
  capabilityId: string,
  payload: CapabilityPayload
) {
  return cast<ApiResponse<CapabilityDto>>(
    api.put(`${BASE}/${branchId}/capability/${capabilityId}`, payload)
  );
}

export function deleteCapability(branchId: string, capabilityId: string) {
  return cast<ApiResponse<null>>(
    api.delete(`${BASE}/${branchId}/capability/${capabilityId}`)
  );
}
