import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  return useMutation({
    mutationFn: (payload: CreateCustomerTypePayload) => createCustomerType(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success("Customer type created.");
    },
    onError: () => toast.error("Failed to create customer type."),
  });
}

export function useUpdateCustomerType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCustomerTypePayload }) =>
      updateCustomerType(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success("Customer type updated.");
    },
    onError: () => toast.error("Failed to update customer type."),
  });
}

export function useDeleteCustomerType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomerType(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success("Customer type deleted.");
    },
    onError: () => toast.error("Failed to delete customer type."),
  });
}
