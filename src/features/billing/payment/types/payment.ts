export interface PaymentItem {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: "bank_transfer" | "e_wallet" | "credit_card" | "convenience_store";
  status: "pending" | "confirmed" | "failed";
  paidDate: string;
  confirmedBy?: string;
  referenceNumber?: string;
  createdAt: string;
}

export interface PaymentMetadata {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
}

export interface PaymentListResponse {
  data: PaymentItem[];
  metadata: PaymentMetadata;
}

export interface PaymentParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: string;
  method?: string;
}
