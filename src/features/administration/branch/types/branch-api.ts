import type { GeographicPolygon } from "./branch";

// ─── API Request Payloads ─────────────────────────────────────────────────────

export interface BranchPayload {
  name: string;
  code?: string;
  is_active: boolean;
  type?: string;
  level?: string;
  branch_parent_id?: string | null;
  address?: string;
  geographic_polygon?: GeographicPolygon;
  cable_route_factor?: number;
  lat?: number;
  long?: number;
}

// ─── API Response Envelope ────────────────────────────────────────────────────
// Matches response.Base from Swagger: { data, error, message, metadata }

export interface ApiResponse<T> {
  data: T | null;
  error: string;
  message: string;
  metadata?: unknown;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface BranchListResponse<T> {
  branches: T[];
  metadata: PaginationMeta;
}

// ─── Branch Entity Shapes (from API) ─────────────────────────────────────────
// All CRUD endpoints return dto.ResponseBranch regardless of level

export interface BranchDto {
  id: string;
  name: string;
  code: string;
  level: string;
  type?: string;
  branch_parent_id?: string;
  is_active: boolean;
  address?: string;
  geographic_polygon?: GeographicPolygon | string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Keep level-specific aliases for backwards compat with branch-queries.ts
export type RegionalBranchDto = BranchDto;
export type AreaBranchDto = BranchDto;
export type SubAreaBranchDto = BranchDto;

// ─── Flat List (GET /branch/) ─────────────────────────────────────────────────
// dto.ResponseBranchWithParent

export interface BranchFlatDto {
  id: string;
  name: string;
  code: string;
  level_name: string;
  branch_type: string;
  is_active: boolean;
  parent_branch_name: string | null;
  address?: string;
  geographic_polygon?: GeographicPolygon | string;
  branch_regional_id?: string | null;
  branch_area_id?: string | null;
}

export interface BranchFlatListResponse {
  branches: BranchFlatDto[];
  metadata: PaginationMeta;
}

// ─── Tree Structure ───────────────────────────────────────────────────────────
// dto.ResponseRegional → dto.ResponseArea → dto.ResponseSubArea

export interface SubAreaTreeDto {
  id: string;
  name: string;
  code: string;
  level_name: string;
  branch_area_id: string;
  branch_regional_id: string;
}

export interface AreaTreeDto {
  id: string;
  name: string;
  code: string;
  level_name: string;
  branch_regional_id: string;
  sub_areas: SubAreaTreeDto[];
}

export interface BranchTreeNode {
  id: string;
  name: string;
  code: string;
  level_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  areas: AreaTreeDto[];
}

export interface BranchTreeResponse {
  branches: BranchTreeNode[];
  metadata: PaginationMeta;
}

// ─── Branch Detail (GET /branch/:id) ─────────────────────────────────────────

export interface BranchDetailDto {
  id: string;
  name: string;
  code: string;
  level: string;
  type?: string;
  is_active: boolean;
  address?: string;
  cable_route_factor?: number;
  geographic_polygon?: GeographicPolygon | string | null;
  lat?: number | null;
  lon?: number | null;
  long?: number | null;
  branch_regional?: { id: string; branch_name: string } | null;
  branch_area?: { id: string; branch_name: string } | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface BranchListParams {
  page?: number;
  per_page?: number;
  type?: string;
  search?: string;
  branch_type?: string;
  level?: string;
}
