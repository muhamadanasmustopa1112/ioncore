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

export type BroadbandCustomerType = "broadband" | "business" | "both";

export interface BroadbandPlan {
  id: string;
  name: string;
  speed_download_mbps: number;
  speed_upload_mbps: number;
  price: number;
  one_time_charge: number;
  customer_type: BroadbandCustomerType;
  temporary_activation_window_hours: number;
  bandwidth_profile_id: string;
  is_active: boolean;
  branches?: string[];
  created_at: string;
  updated_at: string;
}

export interface BroadbandPlanListData {
  broadband_plans: BroadbandPlan[];
  metadata: PaginationMeta;
}

export interface BroadbandPlanListParams {
  branch_id?: string;
  customer_type?: BroadbandCustomerType;
  name?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

export interface CreateBroadbandPlanPayload {
  name: string;
  speed_download_mbps: number;
  speed_upload_mbps: number;
  price: number;
  one_time_charge: number;
  customer_type: BroadbandCustomerType;
  temporary_activation_window_hours: number;
  bandwidth_profile_id?: string;
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

export interface Addon {
  id: string;
  name: string;
  type: AddonType;
  price: number;
  one_time_charge: number;
  profile_change_id: string;
  compatible_plans?: string[];
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
  compatible_plans?: string[];
  is_wo_required: boolean;
  is_active: boolean;
}
