export type AnnouncementPriority = "normal" | "urgent";

export type AnnouncementChannel = "in_app" | "email";

export type AnnouncementTargetRole =
  | "operations_admin"
  | "noc_manager"
  | "noc"
  | "team_leader"
  | "finance_manager"
  | "sales_manager"
  | "management";

export type AnnouncementRecipientStatus =
  | "delivered"
  | "opened"
  | "acknowledged";

export interface AnnouncementAcknowledgmentSummary {
  total_recipients: number;
  acknowledged_count: number;
  pending_count: number;
  pending_users: string[];
}

export interface AnnouncementReadReceiptSummary {
  opened_count: number;
  not_opened_count: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: AnnouncementPriority;
  target_roles: AnnouncementTargetRole[];
  target_branches: string[];
  channels: AnnouncementChannel[];
  created_at: string;
  expires_at: string;
  acknowledgment_summary: AnnouncementAcknowledgmentSummary;
  read_receipt_summary: AnnouncementReadReceiptSummary;
}

export interface AnnouncementRecipient {
  id: string;
  user_id: string;
  user_name: string;
  user_role: AnnouncementTargetRole;
  branch_name: string;
  delivered: boolean;
  opened: boolean;
  acknowledged: boolean;
  acknowledged_at: string | null;
}

export interface AnnouncementListParams {
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
  priority?: AnnouncementPriority | "";
  inbox_filter?: "all" | "unread" | "acknowledged" | "pending" | "";
}

export interface AnnouncementListResponse {
  data: Announcement[];
  metadata: {
    total_data: number;
    total_page: number;
  };
}

export interface AnnouncementFormData {
  title: string;
  body: string;
  priority: AnnouncementPriority;
  target_roles: AnnouncementTargetRole[];
  target_branches: string[];
  channels: AnnouncementChannel[];
  expires_at: string;
}
