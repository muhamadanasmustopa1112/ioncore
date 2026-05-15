export type WoType =
  | "ISP_INSTALLATION"
  | "ISP_MAINTENANCE"
  | "ISP_RELOCATION"
  | "ISP_TERMINATION";

export type WoStatus = "CREATED" | "IN_PROGRESS" | "DONE";

export type WoPriority = "LOW" | "MEDIUM" | "HIGH";

export interface ChecklistItemDto {
  id: string;
  checklist_id: string;
  template_item_id: string | null;
  item_name: string;
  description: string;
  order_number: number;
  is_required: boolean;
  is_checked: boolean;
  notes: string;
  checked_at: string | null;
  checked_by: string | null;
}

export interface ChecklistDto {
  id: string;
  work_order_id: string;
  template_id: string | null;
  name: string;
  items: ChecklistItemDto[];
}

export interface WorkOrderDto {
  id: string;
  wo_number: string;
  title: string;
  description: string;
  type: WoType;
  status: WoStatus;
  priority: WoPriority;
  customer_id: string;
  customer_name: string;
  service_address: string;
  branch_id: string;
  technician_id: string | null;
  technician_name: string | null;
  notes: string;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  checklists?: ChecklistDto[];
}

export interface WorkOrderListResponse {
  work_orders: WorkOrderDto[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
  };
}

export interface WorkOrderFilters {
  status?: WoStatus;
  type?: WoType;
  branch_id?: string;
  area_id?: string;
  sub_area_id?: string;
  page?: number;
  per_page?: number;
}

export interface CreateWorkOrderPayload {
  title: string;
  description?: string;
  type: WoType;
  priority: WoPriority;
  customer_id: string;
  customer_name: string;
  service_address: string;
  branch_id: string;
  notes?: string;
  scheduled_at?: string | null;
}

export interface UpdateWorkOrderPayload {
  title?: string;
  description?: string;
  priority?: WoPriority;
  notes?: string;
  scheduled_at?: string | null;
}

export interface AssignTechnicianPayload {
  technician_id: string;
  technician_name: string;
}

export interface UpdateStatusPayload {
  status: WoStatus;
  notes?: string;
}

export interface CreateChecklistPayload {
  name: string;
  template_id?: string | null;
}

export interface UpdateChecklistItemPayload {
  is_checked: boolean;
  notes?: string;
}
