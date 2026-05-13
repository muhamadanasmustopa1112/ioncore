export interface BroadbandPlanSchema {
  id: string;
  broadband_plan_id: string;
  schema_id: string;
  schema_name: string;
  schema_type: string;
  created_by: string;
  updated_by: string;
}

export interface BroadbandPlanSchemaMeta {
  page: number;
  size: number;
  total: number;
}

export interface BroadbandPlanSchemaListData {
  broadband_plan_schemas: BroadbandPlanSchema[];
  metadata: BroadbandPlanSchemaMeta;
}

export interface BroadbandPlanSchemaListParams {
  broadband_plan_id?: string;
  schema_type?: string;
  schema_id?: string;
  page?: number;
  size?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface CreateBroadbandPlanSchemaPayload {
  broadband_plan_id: string;
  schema_id: string;
  schema_type: string;
}

export interface UpdateBroadbandPlanSchemaPayload {
  broadband_plan_id?: string;
  schema_id?: string;
  schema_type?: string;
}
