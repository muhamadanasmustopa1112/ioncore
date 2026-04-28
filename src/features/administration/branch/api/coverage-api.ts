import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import {
  ApiResponse,
  CoverageDto,
  CoverageListResponse,
  CoveragePayload,
} from "../types/coverage-api";

const BASE = `${services.branch}/branch`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listCoverages(branchId: string) {
  return cast<ApiResponse<CoverageListResponse>>(
    userServiceApi.get(`${BASE}/${branchId}/coverage`)
  );
}

export function createCoverage(branchId: string, payload: CoveragePayload) {
  return cast<ApiResponse<CoverageDto>>(
    userServiceApi.post(`${BASE}/${branchId}/coverage`, payload)
  );
}

export function updateCoverage(
  branchId: string,
  coverageId: string,
  payload: CoveragePayload
) {
  return cast<ApiResponse<CoverageDto>>(
    userServiceApi.put(`${BASE}/${branchId}/coverage/${coverageId}`, payload)
  );
}

export function deleteCoverage(branchId: string, coverageId: string) {
  return cast<ApiResponse<null>>(
    userServiceApi.delete(`${BASE}/${branchId}/coverage/${coverageId}`)
  );
}
