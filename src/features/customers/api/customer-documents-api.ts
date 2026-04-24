import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  CustomerEnvelope,
  CustomerDocumentDto,
  CreateCustomerDocumentPayload,
  ValidateCustomerDocumentPayload,
} from "../types/customers-api";

const BASE = `${services.customer}/v1/customers`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

export function createCustomerDocument(
  customerId: string,
  payload: CreateCustomerDocumentPayload
) {
  return cast<CustomerEnvelope<CustomerDocumentDto>>(
    userServiceApi.post(`${BASE}/${customerId}/documents`, payload)
  );
}

export function createCustomerDocumentsBulk(
  customerId: string,
  documents: CreateCustomerDocumentPayload[]
) {
  return cast<CustomerEnvelope<CustomerDocumentDto[]>>(
    userServiceApi.post(`${BASE}/${customerId}/documents/bulk`, { documents })
  );
}

export function validateCustomerDocument(
  customerId: string,
  docId: string,
  payload: ValidateCustomerDocumentPayload
) {
  return cast<CustomerEnvelope<CustomerDocumentDto>>(
    userServiceApi.patch(`${BASE}/${customerId}/documents/${docId}/validate`, payload)
  );
}
