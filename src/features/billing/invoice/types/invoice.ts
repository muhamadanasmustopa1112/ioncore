export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerType: "broadband" | "business";
  type: "otc" | "recurring" | "addon";
  status: "draft" | "sent" | "paid" | "overdue" | "partial" | "cancelled";
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  fakturPajakNumber?: string;
  billingSchemaVersion: string;
  branch: string;
  notes?: string;
  lineItems: InvoiceLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceMetadata {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
}

export interface InvoiceListResponse {
  data: InvoiceItem[];
  metadata: InvoiceMetadata;
}

export interface InvoiceDetailResponse {
  data: InvoiceItem;
}

export interface InvoiceParams {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: string;
  customer_type?: string;
  type?: string;
}

export interface CreateInvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceRequest {
  customerId: string;
  customerName: string;
  customerType: "broadband" | "business";
  type: "otc" | "recurring" | "addon";
  dueDate: string;
  branch: string;
  notes?: string;
  billingSchemaVersion: string;
  lineItems: CreateInvoiceLineItem[];
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  id: string;
}
