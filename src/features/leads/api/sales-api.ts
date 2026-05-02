import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  SalesEnvelope,
  SalesDto,
  SalesListResponse,
  CreateSalesPayload,
  UpdateSalesPayload,
} from "../types/leads-api";

const BASE = `${services.sales}/saleses`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export interface SalesListParams {
  branch_id?: string;
  name?: string;
  page?: number;
  per_page?: number;
}

export function listSales(params: SalesListParams = {}) {
  return cast<SalesEnvelope<SalesListResponse>>(
    userServiceApi.get(BASE, {
      params: {
        branch_id: params.branch_id,
        name: params.name,
        page: params.page ?? 1,
        per_page: params.per_page ?? 25,
      },
    })
  );
}

export function getSales(id: string) {
  return cast<SalesEnvelope<SalesDto>>(userServiceApi.get(`${BASE}/${id}`));
}

export function createSales(payload: CreateSalesPayload) {
  return cast<SalesEnvelope<SalesDto>>(userServiceApi.post(BASE, payload));
}

export function updateSales(id: string, payload: UpdateSalesPayload) {
  return cast<SalesEnvelope<SalesDto>>(userServiceApi.put(`${BASE}/${id}`, payload));
}

export function deleteSales(id: string) {
  return cast<{ message: string }>(userServiceApi.delete(`${BASE}/${id}`));
}
