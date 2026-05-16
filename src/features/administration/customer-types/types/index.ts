export interface CustomerType {
  id: string;
  name: string;
  label: string;
  description: string;
  is_active: boolean;
}

export interface CustomerTypeListParams {
  search?: string;
  page?: number;
  size?: number;
  order_by?: string;
  order_direction?: "asc" | "desc";
}

export interface CreateCustomerTypePayload {
  name: string;
  label: string;
  description?: string;
  is_active: boolean;
}

export interface UpdateCustomerTypePayload {
  name: string;
  label: string;
  description?: string;
  is_active: boolean;
}

export interface CustomerTypeListEnvelope {
  data: {
    customer_types: CustomerType[];
    metadata: { page: number; size: number; total: number };
  };
  message?: string;
  error?: string;
}

export interface CustomerTypeEnvelope {
  data: CustomerType;
  message?: string;
  error?: string;
}

export interface CustomerTypeActiveEnvelope {
  data: CustomerType[];
  message?: string;
  error?: string;
}
