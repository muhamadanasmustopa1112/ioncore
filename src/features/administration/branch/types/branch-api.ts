// ─── API Request Payloads ─────────────────────────────────────────────────────

export interface BranchPayload {
  name: string;
  code: string;
  is_active: boolean;
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: "Success" | "Error";
  message: string;
  data: T | null;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface BranchListResponse<T> {
  branches: T[];
  pagination: PaginationMeta;
}

// ─── Branch Entity Shapes (from API) ─────────────────────────────────────────

export interface RegionalBranchDto {
  id: string;
  name: string;
  code: string;
  level: "regional";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AreaBranchDto {
  id: string;
  name: string;
  code: string;
  level: "area";
  is_active: boolean;
  regional_branch_id: string;
  created_at: string;
  updated_at: string;
}

export interface SubAreaBranchDto {
  id: string;
  name: string;
  code: string;
  level: "sub_area";
  is_active: boolean;
  area_branch_id: string;
  regional_branch_id: string;
  created_at: string;
  updated_at: string;
}

// ─── Flat List (GET /branch) ──────────────────────────────────────────────────

export interface BranchFlatDto {
  id: string;
  name: string;
  code: string;
  level_name: "REGIONAL" | "AREA" | "SUB_AREA";
  branch_type: string;
  is_active: boolean;
  parent_branch_name: string | null;
}

export interface BranchFlatMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface BranchFlatListResponse {
  branches: BranchFlatDto[];
  metadata: BranchFlatMeta;
}

// ─── Tree Structure ───────────────────────────────────────────────────────────

export interface BranchTreeArea extends AreaBranchDto {
  sub_areas: SubAreaBranchDto[];
}

export interface BranchTreeNode extends RegionalBranchDto {
  areas: BranchTreeArea[];
}

export interface BranchTreeResponse {
  branches: BranchTreeNode[];
  pagination: PaginationMeta;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface BranchListParams {
  page?: number;
  per_page?: number;
}
