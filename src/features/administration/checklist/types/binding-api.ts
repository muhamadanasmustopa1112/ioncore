import type { WoType, MaintenanceSubtype } from "./checklist-template-api";

export type { WoType, MaintenanceSubtype };

export interface ChecklistBindingDto {
  id: string;
  wo_type: WoType;
  maintenance_subtype: MaintenanceSubtype | null;
  product_type: string;
  template_id: string;
  template_name: string;
  template_version: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChecklistBindingPayload {
  wo_type: WoType;
  maintenance_subtype?: MaintenanceSubtype;
  product_type: string;
  template_id: string;
  template_version?: string;
  active?: boolean;
}

export interface BindingListResponse {
  bindings: ChecklistBindingDto[];
}

export interface ServiceChangePolicyDto {
  id: string;
  service_change_type: string;
  from_package_code: string | null;
  to_package_code: string | null;
  requires_checklist_type: WoType;
  notes: string;
  created_at: string;
}

export interface ServiceChangePolicyPayload {
  service_change_type: string;
  from_package_code?: string;
  to_package_code?: string;
  requires_checklist_type: WoType;
  notes?: string;
}

export interface ServiceChangePolicyListResponse {
  policies: ServiceChangePolicyDto[];
}
