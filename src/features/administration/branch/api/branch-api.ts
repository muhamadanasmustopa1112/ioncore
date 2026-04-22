import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
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

const BASE = `${services.branch}/branch`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

// ─── List ─────────────────────────────────────────────────────────────────────

export function getBranchList(params: BranchListParams = {}) {
  return cast<ApiResponse<BranchFlatListResponse>>(
    userServiceApi.get(`${BASE}/`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

// ─── Tree ─────────────────────────────────────────────────────────────────────

export function getBranchTree(params: BranchListParams = {}) {
  return cast<ApiResponse<BranchTreeResponse>>(
    userServiceApi.get(`${BASE}/tree`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

// ─── Regional ─────────────────────────────────────────────────────────────────

export function listRegional(params: BranchListParams = {}) {
  return cast<ApiResponse<BranchListResponse<RegionalBranchDto>>>(
    userServiceApi.get(`${BASE}/regional`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

export function getRegional(id: string) {
  return cast<ApiResponse<RegionalBranchDto>>(
    userServiceApi.get(`${BASE}/regional/${id}`)
  );
}

export function createRegional(payload: BranchPayload) {
  return cast<ApiResponse<RegionalBranchDto>>(
    userServiceApi.post(`${BASE}/regional`, payload)
  );
}

export function updateRegional(id: string, payload: BranchPayload) {
  return cast<ApiResponse<RegionalBranchDto>>(
    userServiceApi.put(`${BASE}/regional/${id}`, payload)
  );
}

export function deleteRegional(id: string) {
  return cast<ApiResponse<null>>(userServiceApi.delete(`${BASE}/regional/${id}`));
}

// ─── Area ─────────────────────────────────────────────────────────────────────

export function listArea(regionalId: string, params: BranchListParams = {}) {
  return cast<ApiResponse<BranchListResponse<AreaBranchDto>>>(
    userServiceApi.get(`${BASE}/regional/${regionalId}/area`, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 100 },
    })
  );
}

export function createArea(regionalId: string, payload: BranchPayload) {
  return cast<ApiResponse<AreaBranchDto>>(
    userServiceApi.post(`${BASE}/regional/${regionalId}/area`, payload)
  );
}

export function updateArea(
  regionalId: string,
  areaId: string,
  payload: BranchPayload
) {
  return cast<ApiResponse<AreaBranchDto>>(
    userServiceApi.put(`${BASE}/regional/${regionalId}/area/${areaId}`, payload)
  );
}

export function deleteArea(regionalId: string, areaId: string) {
  return cast<ApiResponse<null>>(
    userServiceApi.delete(`${BASE}/regional/${regionalId}/area/${areaId}`)
  );
}

// ─── Sub Area ─────────────────────────────────────────────────────────────────

export function listSubArea(
  regionalId: string,
  areaId: string,
  params: BranchListParams = {}
) {
  return cast<ApiResponse<BranchListResponse<SubAreaBranchDto>>>(
    userServiceApi.get(`${BASE}/regional/${regionalId}/area/${areaId}/sub-area`, {
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
    userServiceApi.post(
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
    userServiceApi.put(
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
    userServiceApi.delete(
      `${BASE}/regional/${regionalId}/area/${areaId}/sub-area/${subAreaId}`
    )
  );
}
