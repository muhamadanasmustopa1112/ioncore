export interface PurchaseReceiptLineInput {
  stock_item_id: number;
  quantity: number;
  unit_cost: number;
  serials: string[];
  mac_addresses: string[];
}

export interface CreatePurchaseReceiptRequest {
  destination_warehouse_id: number;
  lines: PurchaseReceiptLineInput[];
  notes?: string;
  purchase_date: string;
  receipt_number?: string;
  received_at: string;
  reference_number?: string;
  vendor_name?: string;
}

export interface PurchaseReceiptResponse {
  id: number;
  destination_warehouse_id: number;
  receipt_number: string;
  purchase_date: string;
  received_at: string;
  vendor_name: string;
  notes: string;
  reference_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}
