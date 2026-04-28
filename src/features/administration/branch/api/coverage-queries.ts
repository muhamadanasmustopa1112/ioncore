import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CoveragePayload, CoverageDto } from "../types/coverage-api";
import { CoverageData } from "../types/coverage";
import {
  listCoverages,
  createCoverage,
  updateCoverage,
  deleteCoverage,
} from "./coverage-api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const coverageKeys = {
  all: ["coverages"] as const,
  byBranch: (branchId: string) =>
    [...coverageKeys.all, "branch", branchId] as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeCoverageJson(raw: CoverageDto["coverage_json"] | null | undefined) {
  return {
    service_area: toStringArray(raw?.service_area),
    warehouse_coverage: toStringArray(raw?.warehouse_coverage),
    network_scope: typeof raw?.network_scope === "string" ? raw.network_scope : "",
    dispatch_radius_km:
      typeof raw?.dispatch_radius_km === "number" ? raw.dispatch_radius_km : 0,
  };
}

function mapToCoverageData(dto: CoverageDto): CoverageData {
  return {
    id: dto.id,
    branchId: dto.branch_id,
    name: typeof dto.name === "string" ? dto.name : "",
    description: typeof dto.description === "string" ? dto.description : "",
    isActive: dto.is_active,
    coverageJson: normalizeCoverageJson(dto.coverage_json),
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useCoverageList(branchId: string) {
  return useQuery({
    queryKey: coverageKeys.byBranch(branchId),
    queryFn: async () => {
      try {
        const res = await listCoverages(branchId);
        const raw = res.data;
        const items: CoverageDto[] = Array.isArray(raw)
          ? raw
          : (raw?.coverages ?? []);
        return items.map(mapToCoverageData);
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

export function useCreateCoverage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      payload,
    }: {
      branchId: string;
      payload: CoveragePayload;
    }) => createCoverage(branchId, payload),
    onSuccess: (_, { branchId }) => {
      toast.success("Coverage area created successfully");
      qc.invalidateQueries({ queryKey: coverageKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to create coverage area"),
  });
}

export function useUpdateCoverage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      coverageId,
      payload,
    }: {
      branchId: string;
      coverageId: string;
      payload: CoveragePayload;
    }) => updateCoverage(branchId, coverageId, payload),
    onSuccess: (_, { branchId }) => {
      toast.success("Coverage area updated successfully");
      qc.invalidateQueries({ queryKey: coverageKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to update coverage area"),
  });
}

export function useDeleteCoverage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      coverageId,
    }: {
      branchId: string;
      coverageId: string;
    }) => deleteCoverage(branchId, coverageId),
    onSuccess: (_, { branchId }) => {
      toast.success("Coverage area deleted successfully");
      qc.invalidateQueries({ queryKey: coverageKeys.byBranch(branchId) });
    },
    onError: () => toast.error("Failed to delete coverage area"),
  });
}
