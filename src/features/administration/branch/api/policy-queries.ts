import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PolicyPayload, PolicyDto } from "../types/policy-api";
import { PolicyData } from "../types/policy";
import {
  listPolicies,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "./policy-api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const policyKeys = {
  all: ["policies"] as const,
  byBranch: (branchId: string) =>
    [...policyKeys.all, "branch", branchId] as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const defaultPolicyJson = {
  sla_hours: 24,
  working_hours: { start: "08:00", end: "17:00" },
  timezone: "Asia/Jakarta",
  tax_default: 0.11,
  notification_contacts: [],
  approval_matrix: { level_1: "", level_2: "" },
};

function mapToPolicyData(dto: PolicyDto): PolicyData {
  return {
    id: dto.id,
    branchId: dto.branch_id,
    name: dto.name,
    description: dto.description,
    isActive: dto.is_active,
    policyJson: dto.policy_json ?? defaultPolicyJson,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function usePolicyList(branchId: string) {
  return useQuery({
    queryKey: policyKeys.byBranch(branchId),
    queryFn: async () => {
      try {
        const res = await listPolicies(branchId);
        const raw = res.data;
        const items: PolicyDto[] = Array.isArray(raw)
          ? raw
          : (raw?.policies ?? []);
        return items.map(mapToPolicyData);
      } catch (err) {
        const status = (err as { response?: { status: number } })?.response?.status;
        if (status === 404) return [];
        throw err;
      }
    },
    enabled: !!branchId,
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      payload,
    }: {
      branchId: string;
      payload: PolicyPayload;
    }) => createPolicy(branchId, payload),
    onSuccess: (_, { branchId }) => {
      toast.success("Policy created successfully");
      qc.invalidateQueries({ queryKey: policyKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to create policy"),
  });
}

export function useUpdatePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      policyId,
      payload,
    }: {
      branchId: string;
      policyId: string;
      payload: PolicyPayload;
    }) => updatePolicy(branchId, policyId, payload),
    onSuccess: (_, { branchId }) => {
      toast.success("Policy updated successfully");
      qc.invalidateQueries({ queryKey: policyKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to update policy"),
  });
}

export function useDeletePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      policyId,
    }: {
      branchId: string;
      policyId: string;
    }) => deletePolicy(branchId, policyId),
    onSuccess: (_, { branchId }) => {
      toast.success("Policy deleted successfully");
      qc.invalidateQueries({ queryKey: policyKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to delete policy"),
  });
}
