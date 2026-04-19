import { api } from "@/lib/api-client";
import type {
  NetworkNodeTypeDto,
  NetworkNodeTypePayload,
  NodeTypeListResponse,
  MaintenanceNoticeConfigDto,
  SeedDeploymentListResponse,
} from "../types/master-data-api";

const NODE_BASE = "/administration/network-node-types";
const MAINT_BASE = "/administration/maintenance-notice-config";
const SEED_BASE = "/administration/seed-deployment";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

// Node Types
export function listNodeTypes() {
  return cast<ApiResponse<NodeTypeListResponse>>(api.get(NODE_BASE));
}

export function createNodeType(payload: NetworkNodeTypePayload) {
  return cast<ApiResponse<NetworkNodeTypeDto>>(api.post(NODE_BASE, payload));
}

export function updateNodeType(id: string, payload: Partial<NetworkNodeTypePayload>) {
  return cast<ApiResponse<NetworkNodeTypeDto>>(api.patch(`${NODE_BASE}/${id}`, payload));
}

export function deleteNodeType(id: string) {
  return cast<ApiResponse<null>>(api.delete(`${NODE_BASE}/${id}`));
}

// Maintenance Notice Config
export function listMaintenanceConfig() {
  return cast<ApiResponse<{ configs: MaintenanceNoticeConfigDto[] }>>(api.get(MAINT_BASE));
}

export function updateMaintenanceConfig(customerType: string, leadHours: number) {
  return cast<ApiResponse<MaintenanceNoticeConfigDto>>(
    api.patch(`${MAINT_BASE}/${customerType}`, { default_notice_lead_hours: leadHours })
  );
}

// Seed Deployment
export function listSeedDeployments() {
  return cast<ApiResponse<SeedDeploymentListResponse>>(api.get(`${SEED_BASE}/history`));
}

export function deploySeed(seedName: string) {
  return cast<ApiResponse<{ status: string }>>(api.post(SEED_BASE, { seed_name: seedName }));
}
