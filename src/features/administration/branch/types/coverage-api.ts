import { ApiResponse, PaginationMeta } from "./branch-api";

// ─── Coverage JSON nested fields ─────────────────────────────────────────────

export interface CoverageJson {
  service_area: string[];
  warehouse_coverage: string[];
  network_scope: string;
  dispatch_radius_km: number;
}

// ─── Coverage Payload ─────────────────────────────────────────────────────────

export interface CoveragePayload {
  name: string;
  description: string;
  is_active: boolean;
  coverage_json: CoverageJson;
}

// ─── Coverage DTO ─────────────────────────────────────────────────────────────

export interface CoverageDto {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  is_active: boolean;
  coverage_json: CoverageJson;
  created_at: string;
  updated_at: string;
}

// ─── Coverage List Response ───────────────────────────────────────────────────

export interface CoverageListResponse {
  coverages: CoverageDto[];
  pagination: PaginationMeta;
}

// Re-export for convenience
export type { ApiResponse };
