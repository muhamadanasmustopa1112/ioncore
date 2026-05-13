export type PolicyFormMode = "new" | "edit" | "details" | null;

export interface PolicyData {
  id: string;
  branchId: string;
  name: string;
  description: string;
  isActive: boolean;
  policyJson: {
    sla_hours: number;
    working_hours: { start: string; end: string };
    timezone: string;
    tax_default: number;
    notification_contacts: string[];
    approval_matrix: { level_1: string; level_2: string };
    excess_cable_price?: number;
    cable_threshold_meter?: number;
    cable_route_factor?: number;
    max_cable_run_meter?: number;
    odp_selection_strategy?: {
      type: string;
      weights?: { distance: number; available_capacity: number };
    };
  };
  createdAt: string;
  updatedAt: string;
}
