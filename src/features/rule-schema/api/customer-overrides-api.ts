import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { ruleSchemaKeys } from "./keys";
import type {
  CreateCustomerSchemaRequest,
  CustomerSchema,
  ListCustomerSchemasParams,
  UpdateCustomerSchemaRequest,
} from "../types";

const base = services.customer;
const path = `${base}/customer-schemas`;

// ── Response envelope (customer-service uses same shape as branch-service) ──

interface CustomerServiceEnvelope<T> {
  data: T;
  error: string;
  message: string;
  metadata: null | { page: string; size: string; total: string };
}

// ── API functions ───────────────────────────────────────

export const listCustomerSchemas = (params?: ListCustomerSchemasParams) =>
  userServiceApi.get<unknown, CustomerServiceEnvelope<{ customer_schemas: CustomerSchema[]; metadata: { page: string; size: string; total: string } }>>(
    path,
    { params },
  );

export const getCustomerSchema = (id: string) =>
  userServiceApi.get<unknown, CustomerServiceEnvelope<CustomerSchema>>(
    `${path}/${id}`,
  );

export const createCustomerSchema = (payload: CreateCustomerSchemaRequest) =>
  userServiceApi.post<unknown, CustomerServiceEnvelope<CustomerSchema>>(
    path,
    payload,
  );

export const updateCustomerSchema = (id: string, payload: UpdateCustomerSchemaRequest) =>
  userServiceApi.put<unknown, CustomerServiceEnvelope<CustomerSchema>>(
    `${path}/${id}`,
    payload,
  );

export const deleteCustomerSchema = (id: string) =>
  userServiceApi.delete<unknown, CustomerServiceEnvelope<null>>(`${path}/${id}`);

// ── Empty placeholders ──────────────────────────────────

const EMPTY_META_RAW = { page: "1", size: "10", total: "0" };

const EMPTY_CS_LIST: CustomerServiceEnvelope<{ customer_schemas: CustomerSchema[]; metadata: { page: string; size: string; total: string } }> = {
  data: { customer_schemas: [], metadata: EMPTY_META_RAW },
  error: "",
  message: "",
  metadata: null,
};

// ── Hooks ───────────────────────────────────────────────

export const useCustomerSchemas = (params?: ListCustomerSchemasParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerSchemas(params),
    queryFn: async () => {
      try {
        return await listCustomerSchemas(params);
      } catch {
        return EMPTY_CS_LIST;
      }
    },
    placeholderData: EMPTY_CS_LIST,
    retry: false,
  });

export const useCustomerSchema = (id: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerSchema(id),
    queryFn: async () => {
      try {
        return await getCustomerSchema(id);
      } catch {
        return null;
      }
    },
    enabled: !!id,
    retry: false,
  });

const CS_PREFIX = [...ruleSchemaKeys.all, "customer-schemas"] as const;

export const useCreateCustomerSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerSchemaRequest) => createCustomerSchema(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CS_PREFIX }),
  });
};

export const useUpdateCustomerSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerSchemaRequest }) =>
      updateCustomerSchema(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.customerSchema(id) });
      qc.invalidateQueries({ queryKey: CS_PREFIX });
    },
  });
};

export const useDeleteCustomerSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomerSchema(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CS_PREFIX }),
  });
};

// ── Legacy aliases — remove after components fully migrated ──

/** @deprecated use useCustomerSchemas */
export const useCustomerOverrides = useCustomerSchemas;
/** @deprecated use useCustomerSchema */
export const useCustomerOverride = useCustomerSchema;
/** @deprecated use useCreateCustomerSchema */
export const useCreateCustomerOverride = useCreateCustomerSchema;
/** @deprecated use useUpdateCustomerSchema */
export const useUpdateCustomerOverride = useUpdateCustomerSchema;
/** @deprecated use useDeleteCustomerSchema */
export const useDeleteCustomerOverride = useDeleteCustomerSchema;
