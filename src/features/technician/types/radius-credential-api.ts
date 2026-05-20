/** Response from GET /network/work-orders/{work_order_id}/radius/credential */
export interface WorkOrderRadiusCredential {
  radius_password_plaintext: string;
  radius_username: string;
  status: string;
  viewed_at: string;
  work_order_id: string;
}

export interface WorkOrderRadiusCredentialEnvelope {
  data: WorkOrderRadiusCredential;
  message?: string;
  error?: string;
}

/** Request body for POST /network/work-orders/{work_order_id}/radius/credential/generate */
export interface GenerateRadiusCredentialRequest {
  correlation_id?: string;
  customer_id?: string;
  external_reference?: string;
  force_regenerate?: boolean;
  idempotency_key?: string;
  metadata?: Record<string, any>;
  plan_code?: string;
  port_id?: string;
  requested_expires_at?: string;
  work_order_number?: string;
}

/** Response from POST /network/work-orders/{work_order_id}/radius/credential/generate */
export interface GenerateRadiusCredentialResponse {
  radius_password_plaintext: string;
  radius_username: string;
  status: string;
  work_order_id: string;
}

export interface GenerateRadiusCredentialEnvelope {
  data: GenerateRadiusCredentialResponse;
  message?: string;
  error?: string;
}
