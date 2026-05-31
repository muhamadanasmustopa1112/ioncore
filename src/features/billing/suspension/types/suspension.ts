export interface SuspensionItem {
  id: string;
  customerId: string;
  customerName: string;
  customerType: "broadband" | "business";
  invoiceNumber: string;
  overdueDays: number;
  status: "pending" | "approved" | "suspended" | "restored";
  suspensionDate?: string;
  restoredDate?: string;
  approvedBy?: string;
  reason: string;
  branch: string;
  createdAt: string;
}

export interface SuspensionMetadata {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
}

export interface SuspensionListResponse {
  data: SuspensionItem[];
  metadata: SuspensionMetadata;
}

export interface SuspensionParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: string;
}
