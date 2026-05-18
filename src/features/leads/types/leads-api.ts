// Sales Service response envelope — uses { data } on success, { error } on failure.
export interface SalesEnvelope<T> {
  data: T;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export type LeadType = "broadband" | "enterprise";
export type CustomerSubType = "residential" | "business";
export type LeadSource =
  | "referral"
  | "cold_call"
  | "website"
  | "whatsapp"
  | "social_media_dm"
  | "voip_call"
  | "line_call"
  | "walk_in"
  | "event"
  | "partner"
  | "cs_referral";
export type LeadStatus =
  | "new"
  | "active"
  | "warm"
  | "hot"
  | "converted"
  | "lost"
  | "potential";
export type LeadActivityType = "call" | "visit" | "note" | "email" | "status_change";

export interface LeadDto {
  id: string;
  lead_type: LeadType;
  customer_sub_type: CustomerSubType;
  lead_name: string;
  source: LeadSource;
  referrer_customer_id: string | null;
  assigned_sales_id: string;
  branch_id: string;
  status: LeadStatus;
  cable_distance_meters: number;
  is_excess_cable_accepted: boolean;
  installation_point_lat?: number | null;
  installation_point_lng?: number | null;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface LeadActivityDto {
  id: string;
  lead_id: string;
  type: LeadActivityType;
  notes: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface LeadStatusTimelineDto {
  id: string;
  lead_id: string;
  status: LeadStatus;
  notes: string;
  created_at: string;
  created_by: string;
}

export interface LeadDetail extends LeadDto {
  activities?: LeadActivityDto[];
  status_timeline?: LeadStatusTimelineDto[];
}

export interface LeadListResponse {
  leads: LeadDto[];
  metadata: PaginationMeta;
}

export interface CreateLeadPayload {
  lead_type: LeadType;
  customer_sub_type: CustomerSubType;
  lead_name: string;
  source: LeadSource;
  referrer_customer_id?: string | null;
  branch_id: string;
  assigned_sales_id?: string;
  nik?: string;
  status?: LeadStatus;
  latitude?: number;
  longitude?: number;
}

export interface UpdateLeadPayload {
  lead_type: LeadType;
  customer_sub_type: CustomerSubType;
  lead_name: string;
  source: LeadSource;
  referrer_customer_id?: string | null;
  assigned_sales_id: string;
  branch_id: string;
  status: LeadStatus;
  cable_distance_meters: number;
  is_excess_cable_accepted: boolean;
}

export interface UpdateLeadStatusPayload {
  status: LeadStatus;
  notes?: string;
}

export interface CreateLeadActivityPayload {
  type: LeadActivityType;
  notes: string;
}

export interface RerouteLeadPayload {
  branch_id: string;
  assigned_sales_id: string;
}

export interface LeadListParams {
  branch_id?: string;
  name?: string;
  assigned_sales_id?: string;
  sort_by?: "created_at" | "updated_at" | "status";
  sort_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

// ─── Sales (internal) ────────────────────────────────────────────────────────

export type SalesType = "broadband" | "enterprise" | "both";
export type LeadAssignment = "auto-assign" | "manual";

export interface SalesDto {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  branch_id: string;
  type: SalesType;
  lead_assignment: LeadAssignment;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
}

export interface SalesListResponse {
  saleses: SalesDto[];
  metadata: PaginationMeta;
}

export interface CreateSalesPayload {
  user_id: string;
  name: string;
  phone: string;
  branch_id: string;
  type: SalesType;
  lead_assignment: LeadAssignment;
}

export interface UpdateSalesPayload {
  name: string;
  phone: string;
  branch_id: string;
  type: SalesType;
  lead_assignment: LeadAssignment;
}
