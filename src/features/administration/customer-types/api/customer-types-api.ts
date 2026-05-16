import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  CustomerTypeListParams,
  CustomerTypeListEnvelope,
  CustomerTypeEnvelope,
  CustomerTypeActiveEnvelope,
  CreateCustomerTypePayload,
  UpdateCustomerTypePayload,
} from "../types";

const BASE = `${services.customer}/customer-types`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function listCustomerTypes(params: CustomerTypeListParams = {}) {
  return cast<CustomerTypeListEnvelope>(
    userServiceApi.get(`${BASE}/`, {
      params: {
        page: params.page ?? 1,
        size: params.size ?? 20,
        order_by: params.order_by ?? "created_at",
        order_direction: params.order_direction ?? "desc",
        search: params.search,
      },
    }),
  );
}

export function listActiveCustomerTypes() {
  return cast<CustomerTypeActiveEnvelope>(userServiceApi.get(`${BASE}/active`));
}

export function getCustomerType(id: string) {
  return cast<CustomerTypeEnvelope>(userServiceApi.get(`${BASE}/${id}`));
}

export function createCustomerType(payload: CreateCustomerTypePayload) {
  return cast<CustomerTypeEnvelope>(userServiceApi.post(`${BASE}/`, payload));
}

export function updateCustomerType(id: string, payload: UpdateCustomerTypePayload) {
  return cast<CustomerTypeEnvelope>(userServiceApi.put(`${BASE}/${id}`, payload));
}

export function deleteCustomerType(id: string) {
  return userServiceApi.delete(`${BASE}/${id}`);
}
