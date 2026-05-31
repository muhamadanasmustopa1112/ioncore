import type {
  TicketType,
  TicketStatus,
  TicketPriority,
  TicketChannel,
  TimelineEntryType,
} from "../types";

export const ticketTypeLabel: Record<TicketType, string> = {
  technical_issue: "Technical Issue",
  billing_dispute: "Billing Dispute",
  complaint: "Complaint",
  service_request: "Service Request",
  general_inquiry: "General Inquiry",
};

export const ticketTypeBadgeVariant: Record<TicketType, string> = {
  technical_issue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  billing_dispute: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  complaint: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  service_request: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  general_inquiry: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export const statusLabel: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  pending_customer: "Pending Customer",
  pending_field: "Pending Field",
  resolved: "Resolved",
  closed: "Closed",
  reopened: "Reopened",
};

export const statusBadgeVariant: Record<TicketStatus, string> = {
  open: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  pending_customer: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  pending_field: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  reopened: "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300",
};

export const priorityBadgeVariant: Record<TicketPriority, string> = {
  P1: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  P2: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  P3: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  P4: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export const channelLabel: Record<TicketChannel, string> = {
  portal: "Portal",
  app: "App",
  whatsapp: "WhatsApp",
  social_media_dm: "Social DM",
  voip_call: "VoIP",
  line: "Line",
  email: "Email",
  cs_manual: "CS Manual",
  public_report: "Public",
};

export const entryTypeIcon: Record<TimelineEntryType, string> = {
  status_change: "bg-blue-500",
  note: "bg-gray-500",
  escalation: "bg-red-500",
  assignment: "bg-purple-500",
  wo_created: "bg-orange-500",
  csat: "bg-green-500",
  mention: "bg-cyan-500",
  reply: "bg-emerald-500",
};

export const entryTypeLabel: Record<TimelineEntryType, string> = {
  status_change: "Status Change",
  note: "Note",
  escalation: "Escalation",
  assignment: "Assignment",
  wo_created: "WO Created",
  csat: "CSAT",
  mention: "Mention",
  reply: "Reply",
};

export const customerTypeBadgeVariant: Record<string, string> = {
  broadband: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  business: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  enterprise: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  corporate: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export const woStatusBadgeVariant: Record<string, string> = {
  created: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  in_progress: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  pending_assignment: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};
