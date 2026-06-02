export interface Project {
  id: string;
  project_name: string;
  customer_id: string;
  customer_name: string;
  account_manager: string;
  project_type: "new_installation" | "expansion" | "upgrade" | "migration";
  services: ProjectService[];
  contract_value: number;
  currency: "IDR";
  contract_start_date: string;
  contract_end_date: string;
  sla_template_id: string;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
  multi_site: boolean;
  sites: ProjectSite[];
  milestones: ProjectMilestone[];
  vendors: ProjectVendor[];
  linked_wo_ids: string[];
  linked_invoice_ids: string[];
  s_curve_health: "green" | "yellow" | "red";
  percent_planned: number;
  percent_actual: number;
  budget_total: number;
  budget_spent: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectSite {
  id: string;
  site_name: string;
  address: string;
  branch_id: string;
  area_id: string;
  sub_area_id: string;
  gps_lat?: number;
  gps_lng?: number;
}

export interface ProjectMilestone {
  id: string;
  milestone_name: string;
  planned_date: string;
  actual_date?: string;
  completion_criteria: string;
  responsible_role: "sales" | "technician" | "ops" | "vendor";
  weight_percentage: number;
  status: "pending" | "in_progress" | "completed" | "delayed";
  site_id?: string;
}

export interface ProjectService {
  id: string;
  service_id: string;
  service_name: string;
  site_id: string;
  mrc: number;
  otc: number;
  status: "pending" | "active" | "suspended" | "terminated";
}

export interface ProjectVendor {
  vendor_id: string;
  vendor_name: string;
  service_id: string;
  po_number?: string;
  total_cost: number;
}

export interface SCurveDataPoint {
  date: string;
  planned_cumulative: number;
  actual_cumulative: number;
}

export interface ProjectListParams {
  name?: string;
  status?: string;
  project_type?: string;
  page?: number;
  per_page?: number;
}

export interface ProjectListData {
  projects: Project[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface CreateProjectPayload {
  project_name: string;
  customer_id: string;
  customer_name: string;
  account_manager: string;
  project_type: "new_installation" | "expansion" | "upgrade" | "migration";
  contract_value: number;
  currency: "IDR";
  contract_start_date: string;
  contract_end_date: string;
  sla_template_id: string;
  status: "planning" | "in_progress" | "on_hold" | "completed" | "cancelled";
}
