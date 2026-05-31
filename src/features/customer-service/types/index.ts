export type TicketType =
  | "technical_issue"
  | "billing_dispute"
  | "complaint"
  | "service_request"
  | "general_inquiry";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending_customer"
  | "pending_field"
  | "resolved"
  | "closed"
  | "reopened";

export type TicketPriority = "P1" | "P2" | "P3" | "P4";

export type TicketChannel =
  | "portal"
  | "app"
  | "whatsapp"
  | "social_media_dm"
  | "voip_call"
  | "line"
  | "email"
  | "cs_manual"
  | "public_report";

export type ComplaintType =
  | "network_quality"
  | "staff_behavior"
  | "installation_delay"
  | "service_outage_complaint"
  | "termination_dispute"
  | "billing_formal";

export type TimelineEntryType =
  | "status_change"
  | "note"
  | "escalation"
  | "assignment"
  | "wo_created"
  | "csat"
  | "mention"
  | "reply";

export type CustomerType = "broadband" | "business" | "enterprise" | "corporate";

export interface TicketAssignment {
  id: string;
  role: string;
  branch_name: string | null;
  user_id: string | null;
  user_name: string | null;
  is_primary: boolean;
  assigned_at: string;
}

export interface TicketTimelineEntry {
  id: string;
  entry_type: TimelineEntryType;
  content: string;
  created_by: string;
  created_by_role: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
}

export interface TicketCsat {
  rating: number;
  comment: string | null;
  submitted_at: string | null;
  flagged_for_review: boolean;
}

export interface TicketLinkedWo {
  wo_id: string;
  wo_number: string;
  wo_type: string;
  status: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_type: CustomerType | null;
  customer_phone: string | null;
  customer_email: string | null;
  reporter_name: string | null;
  reporter_phone: string | null;
  ticket_type: TicketType;
  complaint_type: ComplaintType | null;
  subject: string;
  description: string;
  channel: TicketChannel;
  priority: TicketPriority;
  status: TicketStatus;
  sla_first_response_due: string;
  sla_resolution_due: string;
  sla_first_response_at: string | null;
  sla_breached: boolean;
  assignments: TicketAssignment[];
  timeline: TicketTimelineEntry[];
  csat: TicketCsat | null;
  linked_wos: TicketLinkedWo[];
  reopen_count: number;
  max_reopens: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface CsatSummary {
  average_rating: number;
  total_responses: number;
  distribution: Record<number, number>;
  flagged_count: number;
  trend: "up" | "down" | "neutral";
}

export interface CsDashboardKpi {
  open_tickets: number;
  in_progress_tickets: number;
  overdue_tickets: number;
  sla_breach_count: number;
  avg_first_response_minutes: number;
  avg_resolution_hours: number;
  csat_average: number;
  tickets_resolved_today: number;
}

export interface TicketListParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: TicketStatus;
  ticket_type?: TicketType;
  priority?: TicketPriority;
  channel?: TicketChannel;
  [key: string]: unknown;
}

export interface TicketListResponse {
  data: Ticket[];
  metadata?: {
    total_data: number;
    total_page: number;
  };
}
