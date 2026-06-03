export interface IntercompanyPoLine {
  id: string;
  service_id: string;
  service_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  expected_delivery_date: string;
}

export interface IntercompanyPo {
  id: string;
  issuer_company_id: string;
  issuer_company_name: string;
  receiver_company_id: string;
  receiver_company_name: string;
  project_id?: string;
  boq_version_id?: string;
  status: "draft" | "pending_approval" | "issued" | "accepted" | "rejected" | "in_fulfillment" | "closed";
  lines: IntercompanyPoLine[];
  total_amount: number;
  pdf_url?: string;
  accepted_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface IcPoListParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface IcPoListData {
  items: IntercompanyPo[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface CreateIcPoPayload {
  issuer_company_id: string;
  issuer_company_name: string;
  receiver_company_id: string;
  receiver_company_name: string;
  project_id?: string;
  boq_version_id?: string;
  lines: Omit<IntercompanyPoLine, "id">[];
}

export interface UpdateIcPoPayload extends CreateIcPoPayload {}
