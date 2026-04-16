import { api } from "@/lib/api-client";
import {
  ApiResponse,
  PolicyDto,
  PolicyListResponse,
  PolicyPayload,
} from "../types/policy-api";

const BASE = "/branch";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listPolicies(branchId: string) {
  return cast<ApiResponse<PolicyListResponse>>(
    api.get(`${BASE}/${branchId}/policy`)
  );
}

export function createPolicy(branchId: string, payload: PolicyPayload) {
  return cast<ApiResponse<PolicyDto>>(
    api.post(`${BASE}/${branchId}/policy`, payload)
  );
}

export function updatePolicy(
  branchId: string,
  policyId: string,
  payload: PolicyPayload
) {
  return cast<ApiResponse<PolicyDto>>(
    api.put(`${BASE}/${branchId}/policy/${policyId}`, payload)
  );
}

export function deletePolicy(branchId: string, policyId: string) {
  return cast<ApiResponse<null>>(
    api.delete(`${BASE}/${branchId}/policy/${policyId}`)
  );
}
