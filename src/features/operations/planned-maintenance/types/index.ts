import { z } from "zod";

export type MaintenanceType = "fiber_upgrade" | "olt_maintenance" | "odp_replacement" | "backbone" | "config_change" | "power" | "other";
export type MaintenanceStatus = "draft" | "scheduled" | "approved" | "in_progress" | "completed" | "cancelled" | "escalated_to_war_room";
export type ServiceImpact = "full_outage" | "degraded" | "no_impact";
export type NodeImpactRole = "primary" | "upstream" | "downstream";
export type TimelineEntryType = "scheduled" | "approval" | "update" | "broadcast" | "task" | "wo" | "completed" | "cancelled" | "escalation";

export interface MaintenanceAffectedArea {
  area_id: string;
  area_name: string;
  sub_area_ids: string[];
  sub_area_names: string[];
}

export interface MaintenanceImpactedNode {
  node_id: string;
  node_name: string;
  node_type: string;
  impact_role: NodeImpactRole;
}

export interface MaintenanceTimelineEntry {
  id: string;
  entry_type: TimelineEntryType;
  entry_text: string;
  created_at: string;
  created_by: string;
  metadata?: Record<string, unknown>;
}

export interface MaintenanceLinkedWo {
  wo_id: string;
  wo_number: string;
  wo_type: string;
  status: string;
}

export interface MaintenanceNotification {
  channel: string;
  sent_at: string;
  recipient_count: number;
}

export interface MaintenanceEvent {
  id: string;
  operational_event_id: string;
  title: string;
  description?: string;
  maintenance_type: MaintenanceType;
  scheduled_start: string;
  scheduled_end: string;
  estimated_duration_hours: number;
  actual_start?: string;
  actual_end?: string;
  service_impact: ServiceImpact;
  requires_service_suspension: boolean;
  estimated_customers_affected: number;
  confirmed_customers_affected: string[];
  status: MaintenanceStatus;
  affected_areas: MaintenanceAffectedArea[];
  impacted_nodes: MaintenanceImpactedNode[];
  timeline: MaintenanceTimelineEntry[];
  linked_wos: MaintenanceLinkedWo[];
  notifications_sent: MaintenanceNotification[];
  created_by: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  approval_notes?: string;
  outcome_notes?: string;
  updated_at: string;
}

export const maintenanceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or less"),
  description: z.string(),
  maintenance_type: z.enum(["fiber_upgrade", "olt_maintenance", "odp_replacement", "backbone", "config_change", "power", "other"], {
    message: "Please select a maintenance type",
  }),
  scheduled_start: z.string().min(1, "Scheduled start is required"),
  scheduled_end: z.string().min(1, "Scheduled end is required"),
  service_impact: z.enum(["full_outage", "degraded", "no_impact"], {
    message: "Please select service impact level",
  }),
  requires_service_suspension: z.boolean(),
  outcome_notes: z.string(),
});

export type MaintenanceFormData = {
  title: string;
  description: string;
  maintenance_type: MaintenanceType;
  scheduled_start: string;
  scheduled_end: string;
  service_impact: ServiceImpact;
  requires_service_suspension: boolean;
  outcome_notes: string;
};

export type MaintenanceParams = {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: MaintenanceStatus;
  maintenance_type?: MaintenanceType;
  area_id?: string;
};

export type MaintenanceResponse = {
  data: MaintenanceEvent[];
  metadata?: {
    total_data: number;
    total_page: number;
  };
};
