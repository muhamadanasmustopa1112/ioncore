import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type { CustomerTypeListParams, CreateCustomerTypePayload, UpdateCustomerTypePayload } from "../types";
import {
  listCustomerTypes,
  listActiveCustomerTypes,
  createCustomerType,
  updateCustomerType,
  deleteCustomerType,
} from "./customer-types-api";

const KEYS = {
  all: ["customer-types"] as const,
  list: (p: CustomerTypeListParams) => ["customer-types", "list", p] as const,
  active: () => ["customer-types", "active"] as const,
};

export function useCustomerTypeList(params: CustomerTypeListParams = {}) {
  return useQuery({
    queryKey: KEYS.list(params),
    queryFn: async () => {
      const res = await listCustomerTypes(params);
      return {
        items: res.data?.customer_types ?? [],
        meta: res.data?.metadata,
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useActiveCustomerTypes() {
  return useQuery({
    queryKey: KEYS.active(),
    queryFn: async () => {
      const res = await listActiveCustomerTypes();
      return res.data ?? [];
    },
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCustomerType() {
  const qc = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: CreateCustomerTypePayload) => createCustomerType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success(t("administration.customerTypesPage.toastCreated"));
    },
    onError: () => toast.error(t("administration.customerTypesPage.toastCreateFailed")),
  });
}

export function useUpdateCustomerType() {
  const qc = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerTypePayload }) =>
      updateCustomerType(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success(t("administration.customerTypesPage.toastUpdated"));
    },
    onError: () => toast.error(t("administration.customerTypesPage.toastUpdateFailed")),
  });
}

export function useDeleteCustomerType() {
  const qc = useQueryClient();
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (id: string) => deleteCustomerType(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success(t("administration.customerTypesPage.toastDeleted"));
    },
    onError: () => toast.error(t("administration.customerTypesPage.toastDeleteFailed")),
  });
}
