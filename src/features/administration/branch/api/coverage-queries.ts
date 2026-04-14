import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CoveragePayload } from "../types/coverage-api";
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

function mapToCoverageData(dto: {
  id: string;
  branch_id: string;
  area_name: string;
  village: string;
  district: string;
  city: string;
  province: string;
  postal_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}): CoverageData {
  return {
    id: dto.id,
    branchId: dto.branch_id,
    areaName: dto.area_name,
    village: dto.village,
    district: dto.district,
    city: dto.city,
    province: dto.province,
    postalCode: dto.postal_code,
    isActive: dto.is_active,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useCoverageList(branchId: string) {
  return useQuery({
    queryKey: coverageKeys.byBranch(branchId),
    queryFn: async () => {
      const res = await listCoverages(branchId);
      return (res.data?.coverages ?? []).map(mapToCoverageData);
    },
    enabled: !!branchId,
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
