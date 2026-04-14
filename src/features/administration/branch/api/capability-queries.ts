import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CapabilityPayload } from "../types/capability-api";
import { CapabilityData } from "../types/capability";
import {
  listCapabilities,
  createCapability,
  updateCapability,
  deleteCapability,
} from "./capability-api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const capabilityKeys = {
  all: ["capabilities"] as const,
  byBranch: (branchId: string) =>
    [...capabilityKeys.all, "branch", branchId] as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapToCapabilityData(dto: {
  id: string;
  branch_id: string;
  capability_key: string;
  description: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}): CapabilityData {
  return {
    id: dto.id,
    branchId: dto.branch_id,
    capabilityKey: dto.capability_key,
    description: dto.description,
    isEnabled: dto.is_enabled,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useCapabilityList(branchId: string) {
  return useQuery({
    queryKey: capabilityKeys.byBranch(branchId),
    queryFn: async () => {
      const res = await listCapabilities(branchId);
      return (res.data?.capabilities ?? []).map(mapToCapabilityData);
    },
    enabled: !!branchId,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateCapability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      payload,
    }: {
      branchId: string;
      payload: CapabilityPayload;
    }) => createCapability(branchId, payload),
    onSuccess: (_, { branchId }) => {
      toast.success("Capability created successfully");
      qc.invalidateQueries({ queryKey: capabilityKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to create capability"),
  });
}

export function useUpdateCapability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      capabilityId,
      payload,
    }: {
      branchId: string;
      capabilityId: string;
      payload: CapabilityPayload;
    }) => updateCapability(branchId, capabilityId, payload),
    onSuccess: (_, { branchId }) => {
      toast.success("Capability updated successfully");
      qc.invalidateQueries({ queryKey: capabilityKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to update capability"),
  });
}

export function useDeleteCapability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      capabilityId,
    }: {
      branchId: string;
      capabilityId: string;
    }) => deleteCapability(branchId, capabilityId),
    onSuccess: (_, { branchId }) => {
      toast.success("Capability deleted successfully");
      qc.invalidateQueries({ queryKey: capabilityKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to delete capability"),
  });
}
