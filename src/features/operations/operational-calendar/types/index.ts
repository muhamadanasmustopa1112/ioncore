export type CalendarEventType = "maintenance" | "bulk_operation" | "announcement" | "incident";
export type CalendarColorCode = "blue" | "purple" | "gray" | "red" | "orange" | "green";
export type CalendarEventStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type ConflictType = "overlapping_maintenance" | "billing_cutoff" | "stock_opname";

export interface CalendarAffectedArea {
  area_id: string;
  area_name: string;
}

export interface CalendarEventMetadata {
  estimated_customers_affected?: number;
  service_impact?: string;
  created_by?: string;
  priority?: "low" | "medium" | "high" | "critical";
}

export interface CalendarEvent {
  event_id: string;
  event_type: CalendarEventType;
  title: string;
  start_date: string;
  end_date: string;
  color_code: CalendarColorCode;
  status: CalendarEventStatus;
  affected_areas: CalendarAffectedArea[];
  has_conflicts: boolean;
  metadata: CalendarEventMetadata;
}

export interface CalendarConflict {
  conflict_type: ConflictType;
  conflicting_event_id: string;
  conflicting_event_title: string;
  conflicting_event_date: string;
  severity: "low" | "medium" | "high";
}

export type CalendarViewType = "monthly" | "weekly" | "list";

export interface CalendarFilters {
  event_types: CalendarEventType[];
  area_id: string | null;
}

export interface CalendarParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  month?: string;
  event_type?: CalendarEventType;
  area_id?: string;
}

export interface CalendarResponse {
  data: CalendarEvent[];
  metadata?: {
    total_data: number;
    total_page: number;
  };
}
