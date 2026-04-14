import { ApiResponse, PaginationMeta } from "./branch-api";

// ─── Coverage Payload ─────────────────────────────────────────────────────────

export interface CoveragePayload {
  area_name: string;
  village?: string;
  district?: string;
  city: string;
  province: string;
  postal_code?: string;
  is_active: boolean;
}

// ─── Coverage DTO ─────────────────────────────────────────────────────────────

export interface CoverageDto {
  id: string;
  branch_id: string;
  area_name: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  is_active: boolean;
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
