import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  CustomerEnvelope,
  CustomerListEnvelope,
  CustomerDto,
  CustomerDetail,
  CustomerListParams,
  CreateCustomerPayload,
  CreateCustomerFromLeadPayload,
  UpdateCustomerPayload,
  UpdateCustomerLocationPayload,
  UpdateCustomerAttributePayload,
  KtpScanPayload,
  KtpScanResult,
} from "../types/customers-api";

const BASE = `${services.customer}/customers`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listCustomers(params: CustomerListParams = {}) {
  return cast<CustomerListEnvelope<CustomerDto>>(
    userServiceApi.get(`${BASE}/`, {
      params: {
        page: params.page ?? 1,
        size: params.size ?? 25,
        order_by: params.order_by ?? "created_at",
        order_direction: params.order_direction ?? "desc",
        status: params.status,
        customer_type: params.customer_type,
        branch_id: params.branch_id,
        search: params.search,
      },
    })
  );
}

export function getCustomer(id: string) {
  return cast<CustomerEnvelope<CustomerDetail>>(userServiceApi.get(`${BASE}/${id}`));
}

export function createCustomer(payload: CreateCustomerPayload) {
  return cast<CustomerEnvelope<CustomerDto>>(userServiceApi.post(`${BASE}/`, payload));
}

export function createCustomerFromLead(payload: CreateCustomerFromLeadPayload) {
  return cast<CustomerEnvelope<CustomerDto>>(userServiceApi.post(`${BASE}/from-lead`, payload));
}

export function updateCustomer(id: string, payload: UpdateCustomerPayload) {
  return cast<CustomerEnvelope<CustomerDto>>(
    userServiceApi.put(`${BASE}/${id}`, payload)
  );
}

export function deleteCustomer(id: string) {
  return cast<CustomerEnvelope<null>>(userServiceApi.delete(`${BASE}/${id}`));
}

export function updateCustomerStatus(id: string, status: string) {
  return cast<CustomerEnvelope<CustomerDto>>(
    userServiceApi.patch(`${BASE}/${id}/status`, { status })
  );
}

export function updateCustomerLocation(
  id: string,
  payload: UpdateCustomerLocationPayload
) {
  return cast<CustomerEnvelope<CustomerDto>>(
    userServiceApi.patch(`${BASE}/${id}/location`, payload)
  );
}

export function updateCustomerAttribute(
  id: string,
  payload: UpdateCustomerAttributePayload
) {
  return cast<CustomerEnvelope<CustomerDto>>(
    userServiceApi.patch(`${BASE}/${id}/attribute`, payload)
  );
}

// confirm endpoint path with BE — expected: POST /v1/customers/ktp/scan
export function scanKtpPhoto(payload: KtpScanPayload) {
  return cast<CustomerEnvelope<KtpScanResult>>(
    userServiceApi.post(`${services.customer}/ktp/scan`, payload)
  );
}
