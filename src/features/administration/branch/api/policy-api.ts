import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import {
  ApiResponse,
  PolicyDto,
  PolicyListResponse,
  PolicyPayload,
} from "../types/policy-api";

const BASE = `${services.branch}/branch`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listPolicies(branchId: string) {
  return cast<ApiResponse<PolicyListResponse>>(
    userServiceApi.get(`${BASE}/${branchId}/policy`)
  );
}

export function createPolicy(branchId: string, payload: PolicyPayload) {
  return cast<ApiResponse<PolicyDto>>(
    userServiceApi.post(`${BASE}/${branchId}/policy`, payload)
  );
}

export function updatePolicy(
  branchId: string,
  policyId: string,
  payload: PolicyPayload
) {
  return cast<ApiResponse<PolicyDto>>(
    userServiceApi.put(`${BASE}/${branchId}/policy/${policyId}`, payload)
  );
}

export function deletePolicy(branchId: string, policyId: string) {
  return cast<ApiResponse<null>>(
    userServiceApi.delete(`${BASE}/${branchId}/policy/${policyId}`)
  );
}
