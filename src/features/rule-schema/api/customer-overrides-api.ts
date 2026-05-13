import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { ruleSchemaKeys } from "./keys";
import type {
  CreateCustomerOverrideRequest,
  CustomerOverrideListData,
  CustomerOverrideSchema,
  ListCustomerOverridesParams,
  OverrideContentDiff,
  RuleSchemaEnvelope,
  UpdateCustomerOverrideRequest,
} from "../types";

const base = services.ruleScheme;
const path = `${base}/customer-override-schemas`;

// ── API functions ───────────────────────────────────────

export const listCustomerOverrides = (params?: ListCustomerOverridesParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<CustomerOverrideListData>>(
    path,
    { params },
  );

export const getCustomerOverride = (id: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<CustomerOverrideSchema>>(
    `${path}/${id}`,
  );

export const createCustomerOverride = (payload: CreateCustomerOverrideRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<CustomerOverrideSchema>>(
    path,
    payload,
  );

export const updateCustomerOverride = (
  id: string,
  payload: UpdateCustomerOverrideRequest,
) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<CustomerOverrideSchema>>(
    `${path}/${id}`,
    payload,
  );

export const deleteCustomerOverride = (id: string) =>
  userServiceApi.delete<unknown, RuleSchemaEnvelope<null>>(`${path}/${id}`);

export const getCustomerOverrideDiff = (id: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<OverrideContentDiff>>(
    `${path}/${id}/content-diff`,
  );

// ── Empty placeholders ──────────────────────────────────

const EMPTY_META = { page: 1, size: 10, total: 0 };

const EMPTY_CO_LIST: RuleSchemaEnvelope<CustomerOverrideListData> = {
  data: { customer_override_schemas: [], metadata: EMPTY_META },
  error: "",
  message: "",
  metadata: null,
};

// ── Hooks ───────────────────────────────────────────────

export const useCustomerOverrides = (params?: ListCustomerOverridesParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerOverrides(params),
    queryFn: async () => {
      try {
        return await listCustomerOverrides(params);
      } catch {
        return EMPTY_CO_LIST;
      }
    },
    placeholderData: EMPTY_CO_LIST,
    retry: false,
  });

export const useCustomerOverride = (id: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerOverride(id),
    queryFn: async () => {
      try {
        return await getCustomerOverride(id);
      } catch {
        return null;
      }
    },
    enabled: !!id,
    retry: false,
  });

export const useCustomerOverrideDiff = (id: string, enabled = true) =>
  useQuery({
    queryKey: ruleSchemaKeys.customerOverrideDiff(id),
    queryFn: async () => {
      try {
        return await getCustomerOverrideDiff(id);
      } catch {
        return null;
      }
    },
    enabled: !!id && enabled,
    retry: false,
  });

const CO_PREFIX = [...ruleSchemaKeys.all, "customer-overrides"] as const;

export const useCreateCustomerOverride = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerOverrideRequest) =>
      createCustomerOverride(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: CO_PREFIX }),
  });
};

export const useUpdateCustomerOverride = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerOverrideRequest }) =>
      updateCustomerOverride(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.customerOverride(id) });
      qc.invalidateQueries({ queryKey: CO_PREFIX });
    },
  });
};

export const useDeleteCustomerOverride = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomerOverride(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CO_PREFIX }),
  });
};
