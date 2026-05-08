// Single-resource envelope: { data: T, message: string }
export interface CustomerEnvelope<T> {
  data: T;
  message?: string;
}

// List envelope: { data: { customers: T[], metadata: {} }, message: string }
export interface CustomerListEnvelope<T> {
  data: {
    customers: T[];
    metadata?: CustomerListMeta;
  };
  message?: string;
}

export interface CustomerListMeta {
  page: number;
  size: number;
  total: number;
}

export type CustomerType = "residential" | "business" | "enterprise";
export type CustomerStatus =
  | "pending"
  | "active"
  | "suspended"
  | "deactivated"
  | "churned";

export type CustomerDocumentType =
  | "ktp"
  | "npwp"
  | "sim"
  | "passport"
  | "location_photo"
  | "other";
export type CustomerDocumentStatus = "pending" | "approved" | "rejected";

export interface CustomerLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface CustomerDocumentDto {
  id: string;
  customer_id: string;
  document_type: CustomerDocumentType;
  file_url: string;
  status: CustomerDocumentStatus;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerDto {
  id: string;
  lead_id?: string | null;
  customer_type: CustomerType;
  full_name: string;
  company_name?: string | null;
  status: CustomerStatus;
  branch_id: string;
  account_manager_id?: string | null;
  onboarding_schema_version_id?: string | null;
  billing_schema_version_id?: string | null;
  service_schema_version_id?: string | null;
  commission_schema_version_id?: string | null;
  suspension_schema_version_id?: string | null;
  customer_attribute?: Record<string, unknown> | null;
  location?: CustomerLocation | null;
  lat?: number | null;
  lon?: number | null;
  activation_date?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface CustomerDetail extends CustomerDto {
  documents?: CustomerDocumentDto[];
  orders?: Array<{ id: string; status: string; [k: string]: unknown }>;
  work_orders?: Array<{ id: string; status: string; [k: string]: unknown }>;
}

export interface CustomerListParams {
  page?: number;
  size?: number;
  order_by?: "created_at" | "updated_at" | "full_name";
  order_direction?: "asc" | "desc";
  status?: CustomerStatus;
  customer_type?: CustomerType;
  branch_id?: string;
  search?: string;
}

export type KtpEntryMode = "ocr" | "photo";

export interface CreateCustomerPayload {
  customer_type: CustomerType;
  full_name: string;
  branch_id?: string;
  email?: string;
  phone?: string;
  nik?: string;
  address?: string;
  ktp_address?: string;
  ktp_entry_mode?: KtpEntryMode;
  ktp_photo_url?: string;
  company_name?: string;
  account_manager_id?: string;
  customer_attribute?: Record<string, unknown>;
  lead_id?: string;
  lat?: number;
  lon?: number;
}

export type UpdateCustomerPayload = CreateCustomerPayload;

export interface CreateCustomerFromLeadPayload {
  lead_id: string;
  customer_type: CustomerType;
  full_name: string;
  branch_id?: string;
  email?: string;
  phone?: string;
  nik?: string;
  address?: string;
  ktp_address?: string;
  ktp_entry_mode?: KtpEntryMode;
  ktp_photo_url?: string;
  company_name?: string;
  account_manager_id?: string;
  customer_attribute?: Record<string, unknown>;
  documents?: { document_type: string; file_url: string }[];
  lat?: number;
  lon?: number;
}

export interface KtpScanPayload {
  image_url: string;
}

export interface KtpScanResult {
  nik?: string | null;
  full_name?: string | null;
  address?: string | null;
  dob?: string | null;
}

export interface UpdateCustomerLocationPayload {
  location: CustomerLocation;
  photo_url?: string;
}

export interface UpdateCustomerAttributePayload {
  customer_attribute: Record<string, unknown>;
}

export interface CreateCustomerDocumentPayload {
  document_type: CustomerDocumentType;
  file_url: string;
}

export interface ValidateCustomerDocumentPayload {
  action: "approve" | "reject";
  note?: string;
}
