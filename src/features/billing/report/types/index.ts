export interface KpiCard {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
  icon: string;
}

export interface MonthlyRevenue {
  month: string;
  mrr: number;
  otc: number;
  total: number;
}

export interface ArAgingBucket {
  bucket: string;
  count: number;
  amount: number;
}

export interface RevenueByType {
  name: string;
  value: number;
  fill: string;
}

export interface RevenueByBranch {
  branch: string;
  revenue: number;
}

export interface WeeklySuspension {
  week: string;
  suspensions: number;
  reactivations: number;
}

export interface CommissionSummary {
  rep: string;
  paid: number;
  pending: number;
}

export interface InvoiceRegisterRow {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  date: string;
  branch: string;
}

export interface ArAgingDetailRow {
  id: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  daysOverdue: number;
  bucket: string;
}

export interface FakturPajakRow {
  id: string;
  fpNumber: string;
  invoiceNumber: string;
  customerName: string;
  npwp: string;
  dpp: number;
  ppn: number;
  total: number;
}

export interface SuspensionListRow {
  id: string;
  customerName: string;
  status: "suspended" | "reactivated" | "pending";
  suspensionDate: string;
  duration: string;
  branch: string;
}

export interface CommissionDetailRow {
  id: string;
  salesRep: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  split: string;
  status: "paid" | "pending";
}
