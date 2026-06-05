export interface Category {
  id: number;
  category_code: string;
  label: string;
  item_type: number;
  default_maintenance_schedule_id?: string;
  default_install_wo_subtype: string;
  default_required_skills: string[];
  sub_warehouse_allowed_default: boolean;
  requires_serial_at_intake: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesListResponse {
  data: Category[];
  metadata: {
    current_page: number;
    limit: number;
    total_page: number;
    total_data: number;
    sort_by: string;
    sort_order: string;
    filter_by: string;
  };
}
