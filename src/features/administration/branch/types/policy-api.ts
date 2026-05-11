import { ApiResponse, PaginationMeta } from "./branch-api";

// ─── Policy JSON nested fields ────────────────────────────────────────────────

export type OdpSelectionStrategyType =
  | "nearest"
  | "least_loaded"
  | "round_robin"
  | "priority"
  | "weighted";

export interface OdpSelectionStrategy {
  type: OdpSelectionStrategyType;
  weights?: {
    distance: number;
    available_capacity: number;
  };
}

export interface PolicyJson {
  sla_hours: number;
  working_hours: {
    start: string;
    end: string;
  };
  timezone: string;
  tax_default: number;
  notification_contacts: string[];
  approval_matrix: {
    level_1: string;
    level_2: string;
  };
  excess_cable_price?: number;
  cable_threshold_meter?: number;
  cable_route_factor?: number;
  odp_selection_strategy?: OdpSelectionStrategy;
}

// ─── Policy Payload ───────────────────────────────────────────────────────────

export interface PolicyPayload {
  name: string;
  description: string;
  is_active: boolean;
  policy_json: PolicyJson;
}

// ─── Policy DTO ───────────────────────────────────────────────────────────────

export interface PolicyDto {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  is_active: boolean;
  policy_json: PolicyJson;
  created_at: string;
  updated_at: string;
}

// ─── Policy List Response ─────────────────────────────────────────────────────

export interface PolicyListResponse {
  policies: PolicyDto[];
  pagination: PaginationMeta;
}

// Re-export for convenience
export type { ApiResponse };
