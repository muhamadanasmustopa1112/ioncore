export interface PPPCustomer {
  id: string;
  type: string;
  member_id: string;
  servicetype: string;
  nasporttype: string;
  server_name: string | null;
  method: string;
  username: string;
  password: string;
  fullname: string;
  email: string;
  phonenumber: string;
  address: string | null;
  created_at: string;
  plan_name: string;
  total: string;
  renewed_on: string;
  expired_on: string;
  remote_address: string;
  note: string | null;
  trx_invoice: string;
  trx_status: string;
  payment_type: string;
  auth_status: string;
  bind_mac: string;
  mac_address: string | null;
  owner_name: string;
}

export interface PPP_CUSTOMER_PARAMS {
  draw: number;
  start: number;
  length: number;
  [key: string]: any;
}

export interface PPPCustomerMetadata {
  current_page: number;
  limit: number;
  total_page: number;
  total_data: number;
  sort_by: string;
  sort_order: string;
  filter_by: string;
}

export interface PPP_CUSTOMER_RESPONSE {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: PPPCustomer[];
  metadata: PPPCustomerMetadata;
}

export type CreatePPPCustomerRequest = {
  address: string;
  auth_status: string;
  bandwidth: string;
  bind_mac: string;
  created_at: string;
  email: string;
  expired_on: string;
  fullname: string;
  mac_address: string;
  member_id: string;
  method: string;
  nasporttype: string;
  note: string;
  owner_name: string;
  password: string;
  payment_type: string;
  phonenumber: string;
  plan_name: string;
  remote_address: string;
  renewed_on: string;
  server_name: string;
  servicetype: string;
  total: string;
  trx_invoice: string;
  trx_status: string;
  username: string;

};

export type CreatePPPCustomerResponse = {
  message: string;
  data: PPPCustomer;
};
