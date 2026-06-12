import { useMemo } from "react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCustomer,
  createCustomerFromLead,
  deleteCustomer,
  getCustomer,
  listCustomers,
  listReferrerCustomers,
  scanKtpPhoto,
  updateCustomer,
  updateCustomerAttribute,
  updateCustomerLocation,
  updateCustomerStatus,
} from "./customers-api";
import {
  createCustomerDocument,
  createCustomerDocumentsBulk,
  validateCustomerDocument,
} from "./customer-documents-api";
import type {
  CreateCustomerDocumentPayload,
  CreateCustomerFromLeadPayload,
  CreateCustomerPayload,
  CustomerDto,
  CustomerListParams,
  UpdateCustomerAttributePayload,
  UpdateCustomerLocationPayload,
  UpdateCustomerPayload,
  ValidateCustomerDocumentPayload,
} from "../types/customers-api";

const BRANCH_SCOPED_FETCH_SIZE = 100;

export const customerKeys = {
  all: ["customers"] as const,
  list: (params: CustomerListParams) => [...customerKeys.all, "list", params] as const,
  detail: (id: string) => [...customerKeys.all, "detail", id] as const,
};

export function useCustomerList(params: CustomerListParams = {}, enabled = true) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: async () => {
      const res = await listCustomers(params);
      return { items: res.data.customers ?? [], meta: res.data.metadata };
    },
    placeholderData: (prev) => prev,
    enabled,
  });
}

export function useCustomerListByBranches(
  branchIds: string[],
  params: CustomerListParams = {},
  enabled = true,
) {
  const fetchParams: CustomerListParams = {
    ...params,
    page: 1,
    size: BRANCH_SCOPED_FETCH_SIZE,
  };

  const queries = useQueries({
    queries: branchIds.map((branch_id) => ({
      queryKey: customerKeys.list({ ...fetchParams, branch_id }),
      queryFn: async () => {
        const res = await listCustomers({ ...fetchParams, branch_id });
        return { items: res.data.customers ?? [], meta: res.data.metadata };
      },
      enabled: enabled && branchIds.length > 0,
      placeholderData: (prev: { items: CustomerDto[]; meta?: { page: number; size: number; total: number } }) => prev,
    })),
  });

  return useMemo(() => {
    const isLoading = enabled && (branchIds.length === 0 || queries.some((q) => q.isLoading));
    const byId = new Map<string, CustomerDto>();

    for (const query of queries) {
      for (const customer of query.data?.items ?? []) {
        byId.set(customer.id, customer);
      }
    }

    const allCustomers = Array.from(byId.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    const page = params.page ?? 1;
    const size = params.size ?? 25;
    const start = (page - 1) * size;

    return {
      data: {
        items: allCustomers.slice(start, start + size),
        meta: {
          page,
          size,
          total: allCustomers.length,
        },
      },
      isLoading,
    };
  }, [branchIds.length, enabled, params.page, params.size, queries]);
}

export function useReferrerCustomers(params: { search?: string; page?: number; size?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ["customers", "referrer", params],
    queryFn: async () => {
      const res = await listReferrerCustomers(params);
      return { items: res.data.customers ?? [], meta: res.data.metadata };
    },
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async () => (await getCustomer(id)).data,
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createCustomer(payload),
    onSuccess: () => {
      toast.success("Customer created");
      qc.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (err) => toast.error((err as any)?.response?.data?.error ?? (err as any)?.response?.data?.message ?? "Failed to create customer"),
  });
}

export function useCreateCustomerFromLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerFromLeadPayload) => createCustomerFromLead(payload),
    onSuccess: () => {
      toast.success("Customer created from lead");
      qc.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: (err) => toast.error((err as any)?.response?.data?.error ?? (err as any)?.response?.data?.message ?? "Failed to create customer"),
  });
}

export function useUpdateCustomer(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) => updateCustomer(id, payload),
    onSuccess: () => {
      toast.success("Customer updated");
      qc.invalidateQueries({ queryKey: customerKeys.detail(id) });
      qc.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: () => toast.error("Failed to update customer"),
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      toast.success("Customer deleted");
      qc.invalidateQueries({ queryKey: customerKeys.all });
    },
    onError: () => toast.error("Failed to delete customer"),
  });
}

export function useUpdateCustomerStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => updateCustomerStatus(id, status),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: customerKeys.detail(id) });
    },
    onError: () => toast.error("Failed to update status"),
  });
}

export function useUpdateCustomerLocation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerLocationPayload) =>
      updateCustomerLocation(id, payload),
    onSuccess: () => {
      toast.success("Location updated");
      qc.invalidateQueries({ queryKey: customerKeys.detail(id) });
    },
    onError: () => toast.error("Failed to update location"),
  });
}

export function useUpdateCustomerAttribute(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateCustomerAttributePayload) =>
      updateCustomerAttribute(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: customerKeys.detail(id) }),
    onError: () => toast.error("Failed to update attribute"),
  });
}

export function useCreateCustomerDocument(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerDocumentPayload) =>
      createCustomerDocument(customerId, payload),
    onSuccess: () => {
      toast.success("Document uploaded");
      qc.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
    },
    onError: () => toast.error("Failed to upload document"),
  });
}

export function useCreateCustomerDocumentsBulk(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (docs: CreateCustomerDocumentPayload[]) =>
      createCustomerDocumentsBulk(customerId, docs),
    onSuccess: () => {
      toast.success("Documents uploaded");
      qc.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
    },
    onError: () => toast.error("Failed to upload documents"),
  });
}

export function useScanKtpPhoto() {
  return useMutation({
    mutationFn: (imageUrl: string) => scanKtpPhoto({ image_url: imageUrl }),
  });
}

export function useValidateCustomerDocument(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      docId,
      payload,
    }: {
      docId: string;
      payload: ValidateCustomerDocumentPayload;
    }) => validateCustomerDocument(customerId, docId, payload),
    onSuccess: () => {
      toast.success("Document validated");
      qc.invalidateQueries({ queryKey: customerKeys.detail(customerId) });
    },
    onError: () => toast.error("Failed to validate document"),
  });
}
