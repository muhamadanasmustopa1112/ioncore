export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AppliedBillingSchemaRules {
  otcType?: "free" | "prepaid" | "postpaid";
  gracePeriodDays?: number;
  lateFee?: { type: "percentage" | "fixed"; value: number };
  taxRate?: number;
  paymentMethods?: string[];
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerType: "broadband" | "business" | "enterprise" | "corporate";
  type: "otc" | "recurring" | "addon";
  status: "draft" | "sent" | "paid" | "overdue" | "partial" | "cancelled";
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  fakturPajakNumber?: string;
  billingSchemaVersionId: string;
  billingSchemaName?: string;
  billingSchemaVersion?: string;
  appliedSchemaRules?: AppliedBillingSchemaRules;
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
  customerType: "broadband" | "business" | "enterprise" | "corporate";
  type: "otc" | "recurring" | "addon";
  dueDate: string;
  branch: string;
  notes?: string;
  billingSchemaVersionId: string;
  lineItems: CreateInvoiceLineItem[];
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  id: string;
}
