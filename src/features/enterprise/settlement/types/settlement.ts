export type PaymentStatus = "pending" | "paid" | "overdue";

export interface Settlement {
  id: string;
  reseller_name: string;
  period_yyyy_mm: string;
  subscriber_count: number;
  collected_revenue: number;
  wholesale_fee: number;
  revenue_share_pct: number;
  revenue_share_amount: number;
  total_due: number;
  payment_status: PaymentStatus;
  pdf_url: string | null;
  submitted_at: string | null;
  confirmed_at: string | null;
  notes: string;
}

export interface SettlementListParams {
  reseller_name?: string;
  period?: string;
  payment_status?: PaymentStatus;
  page?: number;
  per_page?: number;
}

export interface SettlementListData {
  settlements: Settlement[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}
