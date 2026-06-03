export interface Vendor {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  service_categories: string[];
  payment_terms: "net_15" | "net_30" | "net_45" | "net_60";
  status: "active" | "inactive";
  npwp?: string;
  nib?: string;
  onboarding_date: string;
  created_at: string;
  updated_at: string;
}

export interface VendorPurchaseHistory {
  id: string;
  vendor_id: string;
  service_id: string;
  item_description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  project_reference?: string;
  po_number?: string;
  delivery_status: "pending" | "partial" | "complete";
  notes?: string;
}

export interface VendorPriceBenchmark {
  vendor_id: string;
  vendor_name: string;
  last_purchase_date: string;
  last_price: number;
  avg_price_12m: number;
  total_purchases: number;
}

export interface VendorListParams {
  name?: string;
  category?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface VendorListData {
  vendors: Vendor[];
  metadata: {
    page: number;
    per_page: number;
    total: number;
    total_page: number;
  };
}

export interface CreateVendorPayload {
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  service_categories: string[];
  payment_terms: "net_15" | "net_30" | "net_45" | "net_60";
  npwp?: string;
  nib?: string;
  is_active: boolean;
}

export interface UpdateVendorPayload extends CreateVendorPayload {}
