import { api } from "@/lib/api-client";
import {
  ApiResponse,
  BranchListResponse,
  BranchListParams,
  BranchPayload,
  BranchFlatListResponse,
  BranchTreeResponse,
  RegionalBranchDto,
  AreaBranchDto,
  SubAreaBranchDto,
} from "../types/branch-api";

// Base path for the branch service
const BASE = "/branch";

// The api client interceptor returns response.data, so we cast through unknown
function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export function getBranchList(params: BranchListParams = {}) {
  return cast<ApiResponse<BranchFlatListResponse>>(
    api.get(BASE, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}
// ─── Tree ─────────────────────────────────────────────────────────────────────

export function getBranchTree(params: BranchListParams = {}) {
  return cast<ApiResponse<BranchTreeResponse>>(
    api.get(`${BASE}/tree`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

// ─── Regional ─────────────────────────────────────────────────────────────────

export function listRegional(params: BranchListParams = {}) {
  return cast<ApiResponse<BranchListResponse<RegionalBranchDto>>>(
    api.get(`${BASE}/regional`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

export function getRegional(id: string) {
  return cast<ApiResponse<RegionalBranchDto>>(
    api.get(`${BASE}/regional/${id}`)
  );
}

export function createRegional(payload: BranchPayload) {
  return cast<ApiResponse<RegionalBranchDto>>(
    api.post(`${BASE}/regional`, payload)
  );
}

export function updateRegional(id: string, payload: BranchPayload) {
  return cast<ApiResponse<RegionalBranchDto>>(
    api.put(`${BASE}/regional/${id}`, payload)
  );
}

export function deleteRegional(id: string) {
  return cast<ApiResponse<null>>(api.delete(`${BASE}/regional/${id}`));
}

// ─── Area ─────────────────────────────────────────────────────────────────────

export function listArea(regionalId: string, params: BranchListParams = {}) {
  return cast<ApiResponse<BranchListResponse<AreaBranchDto>>>(
    api.get(`${BASE}/regional/${regionalId}/area`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

export function createArea(regionalId: string, payload: BranchPayload) {
  return cast<ApiResponse<AreaBranchDto>>(
    api.post(`${BASE}/regional/${regionalId}/area`, payload)
  );
}

export function updateArea(
  regionalId: string,
  areaId: string,
  payload: BranchPayload
) {
  return cast<ApiResponse<AreaBranchDto>>(
    api.put(`${BASE}/regional/${regionalId}/area/${areaId}`, payload)
  );
}

export function deleteArea(regionalId: string, areaId: string) {
  return cast<ApiResponse<null>>(
    api.delete(`${BASE}/regional/${regionalId}/area/${areaId}`)
  );
}

// ─── Sub Area ─────────────────────────────────────────────────────────────────

export function listSubArea(
  regionalId: string,
  areaId: string,
  params: BranchListParams = {}
) {
  return cast<ApiResponse<BranchListResponse<SubAreaBranchDto>>>(
    api.get(`${BASE}/regional/${regionalId}/area/${areaId}/sub-area`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

export function createSubArea(
  regionalId: string,
  areaId: string,
  payload: BranchPayload
) {
  return cast<ApiResponse<SubAreaBranchDto>>(
    api.post(
      `${BASE}/regional/${regionalId}/area/${areaId}/sub-area`,
      payload
    )
  );
}

export function updateSubArea(
  regionalId: string,
  areaId: string,
  subAreaId: string,
  payload: BranchPayload
) {
  return cast<ApiResponse<SubAreaBranchDto>>(
    api.put(
      `${BASE}/regional/${regionalId}/area/${areaId}/sub-area/${subAreaId}`,
      payload
    )
  );
}

export function deleteSubArea(
  regionalId: string,
  areaId: string,
  subAreaId: string
) {
  return cast<ApiResponse<null>>(
    api.delete(
      `${BASE}/regional/${regionalId}/area/${areaId}/sub-area/${subAreaId}`
    )
  );
}
