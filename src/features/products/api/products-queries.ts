import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  BroadbandPlan,
  BroadbandPlanListData,
  BroadbandPlanListParams,
  CreateBroadbandPlanPayload,
  EnterpriseService,
  EnterpriseServiceListData,
  EnterpriseServiceListParams,
  CreateEnterpriseServicePayload,
  Addon,
  AddonListData,
  AddonListParams,
  CreateAddonPayload,
} from "../types/products";
import {
  listActiveBroadbandPlans,
  getActiveBroadbandPlan,
  listActiveEnterpriseServices,
  getActiveEnterpriseService,
  listActiveAddons,
  getActiveAddon,
  adminListBroadbandPlans,
  adminGetBroadbandPlan,
  adminCreateBroadbandPlan,
  adminUpdateBroadbandPlan,
  adminDeleteBroadbandPlan,
  adminAddBranchToBroadbandPlan,
  adminRemoveBranchFromBroadbandPlan,
  adminListEnterpriseServices,
  adminGetEnterpriseService,
  adminCreateEnterpriseService,
  adminUpdateEnterpriseService,
  adminDeleteEnterpriseService,
  adminAddBranchToEnterpriseService,
  adminRemoveBranchFromEnterpriseService,
  adminListAddons,
  adminGetAddon,
  adminCreateAddon,
  adminUpdateAddon,
  adminDeleteAddon,
} from "./products-api";

export const productKeys = {
  all: ["products"] as const,
  broadbandPlans: (params: BroadbandPlanListParams) =>
    [...productKeys.all, "broadband-plans", params] as const,
  broadbandPlan: (id: string) =>
    [...productKeys.all, "broadband-plan", id] as const,
  enterpriseServices: (params: EnterpriseServiceListParams) =>
    [...productKeys.all, "enterprise-services", params] as const,
  enterpriseService: (id: string) =>
    [...productKeys.all, "enterprise-service", id] as const,
  addons: (params: AddonListParams) =>
    [...productKeys.all, "addons", params] as const,
  addon: (id: string) => [...productKeys.all, "addon", id] as const,
};

// ─── Public hooks ─────────────────────────────────────────────────────────────

export function useBroadbandPlans(params: BroadbandPlanListParams = {}) {
  return useQuery<BroadbandPlanListData>({
    queryKey: productKeys.broadbandPlans(params),
    queryFn: async () => {
      const res = await listActiveBroadbandPlans(params);
      return res.data;
    },
  });
}

export function useBroadbandPlan(id: string | null) {
  return useQuery<BroadbandPlan | null>({
    queryKey: productKeys.broadbandPlan(id!),
    queryFn: async () => {
      const res = await getActiveBroadbandPlan(id!);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useEnterpriseServices(params: EnterpriseServiceListParams = {}) {
  return useQuery<EnterpriseServiceListData>({
    queryKey: productKeys.enterpriseServices(params),
    queryFn: async () => {
      const res = await listActiveEnterpriseServices(params);
      return res.data;
    },
  });
}

export function useEnterpriseService(id: string | null) {
  return useQuery<EnterpriseService | null>({
    queryKey: productKeys.enterpriseService(id!),
    queryFn: async () => {
      const res = await getActiveEnterpriseService(id!);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useAddons(params: AddonListParams = {}) {
  return useQuery<AddonListData>({
    queryKey: productKeys.addons(params),
    queryFn: async () => {
      const res = await listActiveAddons(params);
      return res.data;
    },
  });
}

export function useAddon(id: string | null) {
  return useQuery<Addon | null>({
    queryKey: productKeys.addon(id!),
    queryFn: async () => {
      const res = await getActiveAddon(id!);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

// ─── Admin — Broadband Plans ──────────────────────────────────────────────────

export function useAdminBroadbandPlans(params: BroadbandPlanListParams = {}) {
  return useQuery<BroadbandPlanListData>({
    queryKey: [...productKeys.broadbandPlans(params), "admin"],
    queryFn: async () => {
      const res = await adminListBroadbandPlans(params);
      return res.data;
    },
    placeholderData: { broadband_plans: [], metadata: { page: 1, per_page: 10, total: 0 } },
    retry: false,
  });
}

export function useAdminBroadbandPlan(id: string | null) {
  return useQuery<BroadbandPlan | null>({
    queryKey: [...productKeys.broadbandPlan(id!), "admin"],
    queryFn: async () => {
      const res = await adminGetBroadbandPlan(id!);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateBroadbandPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBroadbandPlanPayload) => adminCreateBroadbandPlan(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Broadband plan created.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to create plan."),
  });
}

export function useUpdateBroadbandPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateBroadbandPlanPayload }) =>
      adminUpdateBroadbandPlan(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.broadbandPlan(id) });
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Broadband plan updated.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update plan."),
  });
}

export function useDeleteBroadbandPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteBroadbandPlan(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Broadband plan deleted.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to delete plan."),
  });
}

export function useAddBranchToBroadbandPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, branchId }: { planId: string; branchId: string }) =>
      adminAddBranchToBroadbandPlan(planId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Branch assigned.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to assign branch."),
  });
}

export function useRemoveBranchFromBroadbandPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, branchId }: { planId: string; branchId: string }) =>
      adminRemoveBranchFromBroadbandPlan(planId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Branch removed.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to remove branch."),
  });
}

// ─── Admin — Enterprise Services ─────────────────────────────────────────────

export function useAdminEnterpriseServices(params: EnterpriseServiceListParams = {}) {
  return useQuery<EnterpriseServiceListData>({
    queryKey: [...productKeys.enterpriseServices(params), "admin"],
    queryFn: async () => {
      const res = await adminListEnterpriseServices(params);
      return res.data;
    },
    placeholderData: { enterprise_services: [], metadata: { page: 1, per_page: 10, total: 0 } },
    retry: false,
  });
}

export function useCreateEnterpriseService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEnterpriseServicePayload) => adminCreateEnterpriseService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Enterprise service created.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to create service."),
  });
}

export function useUpdateEnterpriseService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateEnterpriseServicePayload }) =>
      adminUpdateEnterpriseService(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.enterpriseService(id) });
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Enterprise service updated.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update service."),
  });
}

export function useDeleteEnterpriseService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteEnterpriseService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Enterprise service deleted.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to delete service."),
  });
}

export function useAddBranchToEnterpriseService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, branchId }: { serviceId: string; branchId: string }) =>
      adminAddBranchToEnterpriseService(serviceId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Branch assigned.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to assign branch."),
  });
}

export function useRemoveBranchFromEnterpriseService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, branchId }: { serviceId: string; branchId: string }) =>
      adminRemoveBranchFromEnterpriseService(serviceId, branchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Branch removed.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to remove branch."),
  });
}

// ─── Admin — Add-ons ──────────────────────────────────────────────────────────

export function useAdminAddons(params: AddonListParams = {}) {
  return useQuery<AddonListData>({
    queryKey: [...productKeys.addons(params), "admin"],
    queryFn: async () => {
      const res = await adminListAddons(params);
      return res.data;
    },
    placeholderData: { addons: [], metadata: { page: 1, per_page: 10, total: 0 } },
    retry: false,
  });
}

export function useAdminAddon(id: string | null) {
  return useQuery<Addon | null>({
    queryKey: [...productKeys.addon(id!), "admin"],
    queryFn: async () => {
      const res = await adminGetAddon(id!);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAddonPayload) => adminCreateAddon(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Add-on created.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to create add-on."),
  });
}

export function useUpdateAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateAddonPayload }) =>
      adminUpdateAddon(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.addon(id) });
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Add-on updated.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to update add-on."),
  });
}

export function useDeleteAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteAddon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Add-on deleted.");
    },
    onError: (err: Error) => toast.error(err.message ?? "Failed to delete add-on."),
  });
}
