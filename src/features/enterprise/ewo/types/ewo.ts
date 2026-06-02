export type EwoStatus = "draft" | "assigned" | "in_progress" | "completed" | "closed";
export type EwoPriority = "low" | "medium" | "high" | "critical";
export type EwoType = "ewo_x" | "ewo_y";

export interface EwoLine {
  id: string;
  service_name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  status: "pending" | "in_progress" | "completed";
}

export interface EwoStatusHistory {
  id: string;
  from_status: EwoStatus | null;
  to_status: EwoStatus;
  changed_by: string;
  changed_at: string;
  notes?: string;
}

export interface Ewo {
  id: string;
  ewo_number: string;
  project_id: string;
  project_name: string;
  ic_po_id: string;
  executing_company_name: string;
  ewo_type: EwoType;
  status: EwoStatus;
  priority: EwoPriority;
  assigned_technician_name: string;
  scheduled_date: string;
  site_name: string;
  site_address: string;
  lines: EwoLine[];
  notes: string;
  status_history: EwoStatusHistory[];
  created_at: string;
  updated_at: string;
}

export interface EwoListParams {
  search?: string;
  status?: EwoStatus;
  ewo_type?: EwoType;
  priority?: EwoPriority;
  page?: number;
  per_page?: number;
}

export interface EwoListData {
  ewos: Ewo[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface CreateEwoPayload {
  project_id: string;
  project_name: string;
  ic_po_id: string;
  executing_company_name: string;
  ewo_type: EwoType;
  priority: EwoPriority;
  assigned_technician_name: string;
  scheduled_date: string;
  site_name: string;
  site_address: string;
  notes: string;
}

export interface UpdateEwoPayload extends CreateEwoPayload {
  status?: EwoStatus;
}
