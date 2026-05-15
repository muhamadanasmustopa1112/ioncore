import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { ruleSchemaKeys } from "./keys";
import type {
  ContentDiff,
  CreateCustomerSchemaRequest,
  CustomerSchema,
  ListCustomerSchemasParams,
  MigrateCustomerSchemasRequest,
  UpdateCustomerSchemaRequest,
} from "../types";

const base = services.customer;
const path = `${base}/customer-schemas`;

// ── Response envelopes ──────────────────────────────────

interface CustomerEnvelope<T> {
  data: T;
  error: string;
  message: string;
  metadata: null | { page: string; size: string; total: string };
}

interface CustomerListEnvelope {
  data: CustomerSchema[];
  message: string;
}

interface DiffEnvelope {
  data: ContentDiff;
  message: string;
}

// ── API functions ───────────────────────────────────────

/** GET /customers/{customerId}/schemas — customer-scoped, returns array */
export const listCustomerSchemasByCustomer = (customerId: string) =>
  userServiceApi.get<unknown, CustomerListEnvelope>(
    `${base}/customers/${customerId}/schemas`,
  );

export const listCustomerSchemas = (params?: ListCustomerSchemasParams) =>
  userServiceApi.get<unknown, CustomerEnvelope<{ customer_schemas: CustomerSchema[]; metadata: { page: string; size: string; total: string } }>>(
    path,
    { params },
  );

export const getCustomerSchema = (id: string) =>
  userServiceApi.get<unknown, CustomerEnvelope<CustomerSchema>>(
    `${path}/${id}`,
  );

export const createCustomerSchema = (payload: CreateCustomerSchemaRequest) =>
  userServiceApi.post<unknown, CustomerEnvelope<CustomerSchema>>(
    path,
    payload,
  );

export const updateCustomerSchema = (id: string, payload: UpdateCustomerSchemaRequest) =>
  userServiceApi.put<unknown, CustomerEnvelope<CustomerSchema>>(
    `${path}/${id}`,
    payload,
  );

export const deleteCustomerSchema = (id: string) =>
  userServiceApi.delete<unknown, CustomerEnvelope<null>>(`${path}/${id}`);

export const getCustomerSchemaDiff = (id: string) =>
  userServiceApi.get<unknown, DiffEnvelope>(`${path}/${id}/content-diff`);

export const migrateCustomerSchemas = (payload: MigrateCustomerSchemasRequest) =>
  userServiceApi.post<unknown, CustomerEnvelope<null>>(`${path}/migrate`, payload);

// ── Hooks ───────────────────────────────────────────────

const EMPTY_LIST: CustomerListEnvelope = { data: [], message: "" };

export const useCustomerSchemasByCustomer = (customerId: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerSchemas({ customerId }),
    queryFn: async () => {
      try {
        return await listCustomerSchemasByCustomer(customerId);
      } catch {
        return EMPTY_LIST;
      }
    },
    enabled: !!customerId,
    placeholderData: EMPTY_LIST,
    retry: false,
  });

export const useCustomerSchemas = (params?: ListCustomerSchemasParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerSchemas(params),
    queryFn: async () => {
      try {
        return await listCustomerSchemas(params);
      } catch {
        return null;
      }
    },
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

export const useCustomerSchemaDiff = (id: string, enabled = true) =>
  useQuery({
    queryKey: [...ruleSchemaKeys.customerSchema(id), "diff"],
    queryFn: async () => {
      try {
        return await getCustomerSchemaDiff(id);
      } catch {
        return null;
      }
    },
    enabled: !!id && enabled,
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

export const useCustomerSchemasByVersion = (schemaVersionId: string, size = 100) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerSchemas({ schema_version_id: schemaVersionId, size }),
    queryFn: async () => {
      try {
        return await listCustomerSchemas({ schema_version_id: schemaVersionId, size });
      } catch {
        return null;
      }
    },
    enabled: !!schemaVersionId,
    retry: false,
  });

export const useMigrateCustomerSchemas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: MigrateCustomerSchemasRequest) => migrateCustomerSchemas(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CS_PREFIX }),
  });
};

// ── Legacy aliases ──────────────────────────────────────
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
