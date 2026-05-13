import { ApiResponse, PaginationMeta } from "./branch-api";

// ─── Capability JSON nested fields ────────────────────────────────────────────

export interface CapabilityJson {
  sales: boolean;
  helpdesk: boolean;
  dispatch: boolean;
  stock_holding: boolean;
  monitoring: boolean;
  collection: boolean;
  approval: boolean;
  auto_assignment: boolean;
}

// ─── Capability Payload ───────────────────────────────────────────────────────

export interface CapabilityPayload {
  name: string;
  description: string;
  is_active: boolean;
  capability_json: CapabilityJson;
}

// ─── Capability DTO ───────────────────────────────────────────────────────────

export interface CapabilityDto {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  is_active: boolean;
  capability_json: CapabilityJson;
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
