import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import {
  ApiResponse,
  CapabilityDto,
  CapabilityListResponse,
  CapabilityPayload,
} from "../types/capability-api";

const BASE = `${services.branch}/branch`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listCapabilities(branchId: string) {
  return cast<ApiResponse<CapabilityListResponse>>(
    userServiceApi.get(`${BASE}/${branchId}/capability`, {
      params: { page: 1, per_page: 100 },
    })
  );
}

export function createCapability(branchId: string, payload: CapabilityPayload) {
  return cast<ApiResponse<CapabilityDto>>(
    userServiceApi.post(`${BASE}/${branchId}/capability`, payload)
  );
}

export function updateCapability(
  branchId: string,
  capabilityId: string,
  payload: CapabilityPayload
) {
  return cast<ApiResponse<CapabilityDto>>(
    userServiceApi.put(`${BASE}/${branchId}/capability/${capabilityId}`, payload)
  );
}

export function deleteCapability(branchId: string, capabilityId: string) {
  return cast<ApiResponse<null>>(
    userServiceApi.delete(`${BASE}/${branchId}/capability/${capabilityId}`)
  );
}
