export interface ProductEnvelope<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

// ─── Broadband Plans ─────────────────────────────────────────────────────────

export type BroadbandCustomerType = string;

export interface BranchInfo {
  id: string;
  name: string;
  level: string;
  type: string;
}

export interface BroadbandPlanBranch {
  id: string;
  broadband_plan_id: string;
  branch_id: string;
  created_at: string;
  created_by: string;
}

export interface BroadbandPlanBranchesData {
  branches: BranchInfo[];
}

export type BroadbandPlanStatus = "draft" | "in_review" | "rejected" | "approved" | "published" | "inactive";

export interface BroadbandPlan {
  id: string;
  name: string;
  channel: string;
  speed_download_mbps: number;
  speed_upload_mbps: number;
  price: number;
  one_time_charge: number;
  customer_type: BroadbandCustomerType;
  bandwidth_profile_id: string;
  is_active: boolean;
  status: BroadbandPlanStatus;
  notes?: string;
  rejection_notes?: string;
  branches?: BranchInfo[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface BroadbandPlanListData {
  broadband_plans: BroadbandPlan[];
  metadata: PaginationMeta;
}

export interface BroadbandPlanListParams {
  branch_id?: string;
  customer_type?: BroadbandCustomerType;
  channel?: string;
  name?: string;
  is_active?: boolean;
  status?: BroadbandPlanStatus;
  page?: number;
  per_page?: number;
}

export interface RejectBroadbandPlanPayload { notes?: string; }
export interface SetBroadbandPlanVisibilityPayload { status: "published" | "inactive"; notes?: string; }

export interface CreateBroadbandPlanPayload {
  name: string;
  speed_download_mbps: number;
  speed_upload_mbps: number;
  price: number;
  one_time_charge: number;
  customer_type: BroadbandCustomerType;
  is_active: boolean;
}

// ─── Enterprise Services ─────────────────────────────────────────────────────

export type EnterpriseCategory =
  | "connectivity"
  | "security"
  | "entertainment"
  | "data_center"
  | "managed"
  | "infrastructure";

export type EnterpriseDeliveryType = "ion_direct" | "vendor_supplied" | "hybrid";
export type EnterprisePricingType = "fixed" | "negotiated" | "vendor_quoted";
export type EnterpriseUnit = "monthly" | "one_time" | "per_unit" | "per_m2" | "per_rack";

export interface EnterpriseSlaTemplate {
  uptime_percentage: number;
  response_time_hours: number;
  resolution_time_hours: number;
}

export interface EnterpriseService {
  id: string;
  name: string;
  category: EnterpriseCategory;
  delivery_type: EnterpriseDeliveryType;
  unit: EnterpriseUnit;
  base_price: number;
  pricing_type: EnterprisePricingType;
  sla_template: EnterpriseSlaTemplate;
  is_wo_required: boolean;
  wo_type: string;
  is_active: boolean;
  branches?: string[];
  created_at: string;
  updated_at: string;
}

export interface EnterpriseServiceListData {
  enterprise_services: EnterpriseService[];
  metadata: PaginationMeta;
}

export interface EnterpriseServiceListParams {
  branch_id?: string;
  category?: EnterpriseCategory;
  delivery_type?: EnterpriseDeliveryType;
  name?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface CreateEnterpriseServicePayload {
  name: string;
  category: EnterpriseCategory;
  delivery_type: EnterpriseDeliveryType;
  unit: EnterpriseUnit;
  base_price: number;
  pricing_type: EnterprisePricingType;
  sla_template: EnterpriseSlaTemplate;
  is_wo_required: boolean;
  wo_type: string;
  is_active: boolean;
}

// ─── Add-ons ─────────────────────────────────────────────────────────────────

export type AddonType = "digital" | "physical" | "service";

export interface AddonBroadbandPlan {
  id: string;
  name: string;
  speed_download_mbps: number;
  speed_upload_mbps: number;
}

export interface Addon {
  id: string;
  name: string;
  type: AddonType;
  price: number;
  one_time_charge: number;
  profile_change_id: string;
  broadband_plans?: AddonBroadbandPlan[];
  is_wo_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddonListData {
  addons: Addon[];
  metadata: PaginationMeta;
}

export interface AddonListParams {
  name?: string;
  type?: AddonType;
  plan_id?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface CreateAddonPayload {
  name: string;
  type: AddonType;
  price: number;
  one_time_charge: number;
  profile_change_id?: string;
  broadband_plan_ids?: string[];
  is_wo_required: boolean;
  is_active: boolean;
}

export interface UpdateAddonPayload {
  name: string;
  type: AddonType;
  price: number;
  one_time_charge: number;
  profile_change_id?: string;
  add_broadband_plan_ids?: string[];
  remove_broadband_plan_ids?: string[];
  is_wo_required: boolean;
  is_active: boolean;
}
