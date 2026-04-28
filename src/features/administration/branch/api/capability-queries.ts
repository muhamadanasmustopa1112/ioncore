import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CapabilityPayload, CapabilityDto } from "../types/capability-api";
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

const defaultCapabilityJson = {
  sales: false,
  helpdesk: false,
  dispatch: false,
  stock_holding: false,
  monitoring: false,
  collection: false,
  approval: false,
};

function mapToCapabilityData(dto: CapabilityDto): CapabilityData {
  return {
    id: dto.id,
    branchId: dto.branch_id,
    name: dto.name,
    description: dto.description,
    isActive: dto.is_active,
    capabilityJson: dto.capability_json ?? defaultCapabilityJson,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useCapabilityList(branchId: string) {
  return useQuery({
    queryKey: capabilityKeys.byBranch(branchId),
    queryFn: async () => {
      try {
        const res = await listCapabilities(branchId);
        const raw = res.data;
        // API may return data as a direct array or as { capabilities: [] }
        const items: CapabilityDto[] = Array.isArray(raw)
          ? raw
          : (raw?.capabilities ?? []);
        return items.map(mapToCapabilityData);
      } catch (err) {
        const status = (err as { response?: { status: number } })?.response?.status;
        // 404 = no capabilities configured for this branch → treat as empty
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
