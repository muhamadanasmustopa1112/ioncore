export interface Incident {
  id: string;
  operational_event_id: string;
  incident_name: string;
  declared_by: string;
  declared_at: string;
  incident_type: "fiber_cut" | "node_down" | "power_outage" | "ddos" | "config_error" | "vendor_outage" | "unknown";
  severity: "P1" | "P2" | "P3";
  status: "declared" | "active" | "monitoring" | "closed" | "pir_complete";
  affected_areas: AffectedArea[];
  affected_nodes: AffectedNode[];
  timeline: TimelineEntry[];
  tasks: IncidentTask[];
  broadcasts_sent: Broadcast[];
  root_cause?: string;
  total_downtime_minutes: number;
  sla_breached: boolean;
  created_at: string;
}

export interface AffectedArea {
  area_id: string;
  area_name: string;
  estimated_customers_affected: number;
}

export interface AffectedNode {
  node_id: string;
  node_name: string;
  impact_role: "primary" | "upstream" | "downstream";
}

export interface TimelineEntry {
  id: string;
  entry_type: "update" | "escalation" | "broadcast" | "task" | "wo" | "resolution" | "closure";
  message: string;
  created_by: string;
  created_at: string;
  channels?: string;
}

export interface IncidentTask {
  id: string;
  title: string;
  assigned_to_role: string;
  status: "open" | "in_progress" | "done" | "blocked";
  due_by?: string;
  created_at: string;
}

export interface Broadcast {
  id: string;
  broadcast_type: "declared" | "update" | "restored" | "custom";
  message: string;
  channels: string[];
  recipients_count: number;
  delivered_count: number;
  sent_by: string;
  sent_at: string;
}
