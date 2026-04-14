import { api } from "@/lib/api-client";
import {
  ApiResponse,
  CoverageDto,
  CoverageListResponse,
  CoveragePayload,
} from "../types/coverage-api";

const BASE = "/branch";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listCoverages(branchId: string) {
  return cast<ApiResponse<CoverageListResponse>>(
    api.get(`${BASE}/${branchId}/coverage`)
  );
}

export function createCoverage(branchId: string, payload: CoveragePayload) {
  return cast<ApiResponse<CoverageDto>>(
    api.post(`${BASE}/${branchId}/coverage`, payload)
  );
}

export function updateCoverage(
  branchId: string,
  coverageId: string,
  payload: CoveragePayload
) {
  return cast<ApiResponse<CoverageDto>>(
    api.put(`${BASE}/${branchId}/coverage/${coverageId}`, payload)
  );
}

export function deleteCoverage(branchId: string, coverageId: string) {
  return cast<ApiResponse<null>>(
    api.delete(`${BASE}/${branchId}/coverage/${coverageId}`)
  );
}
