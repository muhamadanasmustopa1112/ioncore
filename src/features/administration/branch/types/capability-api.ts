import { ApiResponse, PaginationMeta } from "./branch-api";

// ─── Capability Payload ───────────────────────────────────────────────────────

export interface CapabilityPayload {
  capability_key: string;
  description: string;
  is_enabled: boolean;
}

// ─── Capability DTO ───────────────────────────────────────────────────────────

export interface CapabilityDto {
  id: string;
  branch_id: string;
  capability_key: string;
  description: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Capability List Response ─────────────────────────────────────────────────

export interface CapabilityListResponse {
  capabilities: CapabilityDto[];
  pagination: PaginationMeta;
}

// Re-export for convenience
export type { ApiResponse };
