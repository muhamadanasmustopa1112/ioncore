export interface CommissionSplit {
  salesPerson: number;
  salesManager: number;
  salesBranch: number;
  infraBranch: number;
  company: number;
}

export interface CommissionItem {
  id: string;
  commissionNumber: string;
  salesRepId: string;
  salesRepName: string;
  customerId: string;
  customerName: string;
  invoiceNumber: string;
  totalAmount: number;
  split: CommissionSplit;
  status: "pending" | "paid";
  triggerDate: string;
  paidDate?: string;
  customerType: "broadband" | "business";
  branch: string;
  createdAt: string;
}

export interface CommissionMetadata {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
}

export interface CommissionListResponse {
  data: CommissionItem[];
  metadata: CommissionMetadata;
}

export interface CommissionDetailResponse {
  data: CommissionItem;
}

export interface CommissionParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: string;
}
