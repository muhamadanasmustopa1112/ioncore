export type NodeTypeSource = "seed" | "custom";

export interface NetworkNodeTypeDto {
  id: string;
  type_key: string;
  label: string;
  description: string | null;
  icon_online: string | null;
  icon_offline: string | null;
  icon_trouble: string | null;
  sort_order: number;
  source: NodeTypeSource;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NetworkNodeTypePayload {
  type_key: string;
  label: string;
  description?: string;
  icon_online?: string;
  icon_offline?: string;
  icon_trouble?: string;
  sort_order?: number;
  active?: boolean;
}

export interface MaintenanceNoticeConfigDto {
  customer_type: string;
  default_notice_lead_hours: number;
  updated_at: string;
  updated_by: string | null;
}

export interface SeedDeploymentDto {
  id: string;
  seed_name: string;
  seed_version: string;
  deployed_at: string;
  deployed_by: string;
  status: "applied" | "pending" | "rolled_back";
}

export interface NodeTypeListResponse {
  node_types: NetworkNodeTypeDto[];
}

export interface SeedDeploymentListResponse {
  deployments: SeedDeploymentDto[];
}
