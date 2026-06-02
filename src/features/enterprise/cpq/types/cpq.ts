export interface PreBoq {
  id: string;
  customer_name: string;
  customer_type: "enterprise" | "corporate";
  service_requirements: string;
  estimated_value: number;
  assigned_sales_rep: string;
  status: "draft" | "submitted" | "reviewed" | "approved" | "rejected";
  created_at: string;
}

export interface Rfq {
  id: string;
  pre_boq_id?: string;
  customer_name: string;
  item_description: string;
  quantity: number;
  unit: string;
  deadline: string;
  invited_vendors: RfqVendor[];
  status: "open" | "closed" | "awarded" | "cancelled";
  awarded_vendor_id?: string;
  created_at: string;
}

export interface RfqVendor {
  vendor_id: string;
  vendor_name: string;
  quoted_price?: number;
  notes?: string;
  submitted_at?: string;
}

export interface Boq {
  id: string;
  project_id?: string;
  customer_name: string;
  version: number;
  status: "draft" | "in_approval" | "approved" | "rejected" | "superseded";
  lines: BoqLine[];
  subtotal: number;
  ppn: number;
  grand_total: number;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface BoqLine {
  id: string;
  line_number: number;
  service_id: string;
  service_name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  assigned_provider_company_id?: string;
  provider_response_status?: "pending" | "submitted";
}

export interface Quotation {
  id: string;
  boq_id: string;
  customer_name: string;
  version: number;
  valid_until: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  pdf_url?: string;
  created_at: string;
}

export interface ListMetadata {
  page: number;
  per_page: number;
  total: number;
  total_page: number;
}

export interface PreBoqListParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface PreBoqListData {
  pre_boqs: PreBoq[];
  metadata: ListMetadata;
}

export interface RfqListParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface RfqListData {
  rfqs: Rfq[];
  metadata: ListMetadata;
}

export interface BoqListParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface BoqListData {
  boqs: Boq[];
  metadata: ListMetadata;
}

export interface QuotationListParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface QuotationListData {
  quotations: Quotation[];
  metadata: ListMetadata;
}

export interface CreatePreBoqPayload {
  customer_name: string;
  customer_type: "enterprise" | "corporate";
  service_requirements: string;
  estimated_value: number;
  assigned_sales_rep: string;
}

export interface CreateBoqPayload {
  customer_name: string;
  project_id?: string;
  lines: Omit<BoqLine, "id">[];
}

export interface CreateQuotationPayload {
  boq_id: string;
  customer_name: string;
  valid_until: string;
}
