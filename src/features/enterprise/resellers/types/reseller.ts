export interface Reseller {
  id: string;
  parent_sister_company_id: string;
  parent_sister_company_name: string;
  legal_name: string;
  tax_id: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  status: "draft" | "active" | "suspended" | "terminated";
  platform_tenant_id: string;
  onboarding_date: string;
  created_at: string;
}

export interface ResellerAgreement {
  id: string;
  reseller_id: string;
  wholesale_monthly_fee: number;
  revenue_share_pct: number;
  reporting_day: number;
  compliance_start_month: string;
  status: "draft" | "active" | "suspended" | "terminated";
}

export interface ResellerSubmission {
  id: string;
  reseller_id: string;
  period_yyyy_mm: string;
  collected_amount: number;
  subscriber_count: number;
  submitted_at: string;
  status: "pending" | "confirmed" | "flagged";
}

export interface ResellerSettlement {
  id: string;
  reseller_id: string;
  period_yyyy_mm: string;
  wholesale_fee: number;
  revenue_share_amount: number;
  total_due: number;
  payment_status: "pending" | "paid" | "overdue";
}

export interface ResellerListParams {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ResellerListData {
  resellers: Reseller[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface CreateResellerPayload {
  legal_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  tax_id: string;
  parent_sister_company_id: string;
  status: "draft" | "active" | "suspended" | "terminated";
  platform_tenant_id?: string;
}
