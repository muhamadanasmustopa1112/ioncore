export type BulkOperationType = "plan_change" | "price_adjustment" | "service_modification" | "suspension" | "reactivation" | "odp_migration" | "bulk_wo";

export type BulkOperationStatus = "draft" | "pending_approval" | "approved" | "executing" | "completed" | "failed" | "cancelled" | "partially_failed";

export type ScopeType = "all" | "by_area" | "by_type" | "manual";

export type CustomerType = "broadband" | "business" | "enterprise" | "corporate";

export interface PlanItem {
  id: string;
  name: string;
  monthlyPrice: number;
  speed: string;
  category: string;
}

export interface BulkOperationItem {
  id: string;
  op_type: BulkOperationType;
  title: string;
  description: string;
  scope: string;
  status: BulkOperationStatus;
  affected_customer_count: number;
  billing_delta_summary: {
    total_mrc_increase: number;
    total_mrc_decrease: number;
    no_change_count: number;
  };
  execution_log: ExecutionResult[];
  created_by: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  completed_at?: string;
}

export type BulkOperation = BulkOperationItem;

export interface BulkOperationListResponse {
  data: BulkOperationItem[];
  metadata: {
    total_data: number;
    total_page: number;
  };
}

export interface BulkOperationParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: BulkOperationStatus | "";
  op_type?: BulkOperationType | "";
}

export interface WizardState {
  currentStep: number;
  sourcePlan: PlanItem | null;
  targetPlan: PlanItem | null;
  scopeType: ScopeType;
  selectedAreas: string[];
  selectedCustomerType: CustomerType | null;
  selectedCustomerIds: string[];
  isExecuting: boolean;
  executionProgress: number;
  executionResults: ExecutionResult[];
  reset: () => void;
  setStep: (step: number) => void;
  setSourcePlan: (plan: PlanItem | null) => void;
  setTargetPlan: (plan: PlanItem | null) => void;
  setScopeType: (type: ScopeType) => void;
  setSelectedAreas: (areas: string[]) => void;
  setSelectedCustomerType: (type: CustomerType | null) => void;
  setSelectedCustomerIds: (ids: string[]) => void;
  setExecuting: (executing: boolean) => void;
  setExecutionProgress: (progress: number) => void;
  setExecutionResults: (results: ExecutionResult[]) => void;
}

export interface ExecutionResult {
  customer_id: string;
  customer_name: string;
  status: "success" | "failed" | "pending" | "completed" | "partially_failed" | "cancelled";
  message?: string;
  error_message?: string;
  executed_at?: string;
}

export interface BulkOperationRequest {
  opType: BulkOperationType;
  scope: ScopeType;
  scopeLabel: string;
  description: string;
  sourcePlanId?: string;
  targetPlanId?: string;
  selectedAreas?: string[];
  selectedCustomerType?: CustomerType;
  selectedCustomerIds?: string[];
}
