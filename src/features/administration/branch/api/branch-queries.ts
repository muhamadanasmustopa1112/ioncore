import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BranchData, BranchLevel, BranchType, GeographicPolygon } from "../types";
import { BranchDetailDto, BranchFlatDto, BranchPayload, BranchTreeNode, AreaTreeDto, SubAreaTreeDto } from "../types/branch-api";
import {
  getBranchList,
  getBranchTree,
  getBranchById,
  listRegional,
  listArea,
  listSubArea,
  createRegional,
  updateRegional,
  deleteRegional,
  createArea,
  updateArea,
  deleteArea,
  createSubArea,
  updateSubArea,
  deleteSubArea,
} from "./branch-api";

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const branchKeys = {
  all: ["branches"] as const,
  list: () => [...branchKeys.all, "list"] as const,
  tree: () => [...branchKeys.all, "tree"] as const,
  regional: () => [...branchKeys.all, "regional"] as const,
};

// ─── Helpers: map flat API item → BranchData ─────────────────────────────────

function normalizeGeographicPolygon(value: unknown): GeographicPolygon | undefined {
  if (!value) return undefined;
  if (typeof value !== "string") {
    if (typeof value === "object") return value as GeographicPolygon;
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed === "undefined") return undefined;
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") return parsed as GeographicPolygon;
    return undefined;
  } catch {
    return undefined;
  }
}

function mapBranchFlatToData(dto: BranchFlatDto): BranchData {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    level: dto.level_name.toLowerCase() as BranchLevel,
    parentId: null,
    parentName: dto.parent_branch_name ?? undefined,
    branchType: dto.branch_type.toLowerCase() as BranchType,
    address: dto.address,
    geographic_polygon: normalizeGeographicPolygon(dto.geographic_polygon),
    active: dto.is_active,
    createdAt: "",
    updatedAt: "",
    _regionalId: dto.branch_regional_id ?? undefined,
    _areaId: dto.branch_area_id ?? undefined,
  };
}

// ─── Helpers: flatten tree → BranchData[] ────────────────────────────────────

export function flattenBranchTree(nodes: BranchTreeNode[]): BranchData[] {
  const result: BranchData[] = [];
  for (const regional of nodes) {
    result.push({
      id: regional.id,
      name: regional.name,
      code: regional.code,
      level: "regional",
      parentId: null,
      active: regional.is_active,
      createdAt: regional.created_at,
      updatedAt: regional.updated_at,
      _regionalId: regional.id,
    });
    for (const area of (regional.areas ?? []) as AreaTreeDto[]) {
      result.push({
        id: area.id,
        name: area.name,
        code: area.code,
        level: "area",
        parentId: regional.id,
        parentName: regional.name,
        active: true,
        createdAt: "",
        updatedAt: "",
        _regionalId: regional.id,
        _areaId: area.id,
      });
      for (const sub of (area.sub_areas ?? []) as SubAreaTreeDto[]) {
        result.push({
          id: sub.id,
          name: sub.name,
          code: sub.code,
          level: "sub_area",
          parentId: area.id,
          parentName: area.name,
          active: true,
          createdAt: "",
          updatedAt: "",
          _regionalId: sub.branch_regional_id,
          _areaId: sub.branch_area_id,
        });
      }
    }
  }
  return result;
}

// ─── Helpers: map BranchDetailDto → BranchData ───────────────────────────────

function mapBranchDetailToData(dto: BranchDetailDto): BranchData {
  const level = dto.level.toLowerCase() as BranchLevel;
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    level,
    parentId: dto.branch_area?.id ?? dto.branch_regional?.id ?? null,
    parentName: dto.branch_area?.branch_name ?? dto.branch_regional?.branch_name,
    branchType: dto.type as BranchType | undefined,
    address: dto.address,
    cable_route_factor: dto.cable_route_factor,
    geographic_polygon: normalizeGeographicPolygon(dto.geographic_polygon),
    lat: dto.lat || undefined,
    long: (dto.lon || dto.long) || undefined,
    active: dto.is_active,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    _regionalId: dto.branch_regional?.id,
    _areaId: dto.branch_area?.id,
    _regionalName: dto.branch_regional?.branch_name,
    _areaName: dto.branch_area?.branch_name,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useBranchList(
  params: { page?: number; per_page?: number; search?: string; branch_type?: string; level?: string } = {}
) {
  return useQuery({
    queryKey: [...branchKeys.list(), params] as const,
    queryFn: async () => {
      const res = await getBranchList(params);
      return (res.data?.branches ?? []).map(mapBranchFlatToData);
    },
    placeholderData: [],
  });
}

export interface UseBranchListPaginatedParams {
  page?: number;
  per_page?: number;
  search?: string;
  branch_type?: string;
}

export interface UseBranchListPaginatedResult {
  items: BranchData[];
  total: number;
}

const EMPTY_BRANCH_PAGE: UseBranchListPaginatedResult = { items: [], total: 0 };

export function useBranchListPaginated(params: UseBranchListPaginatedParams = {}) {
  return useQuery<UseBranchListPaginatedResult>({
    queryKey: [...branchKeys.list(), "paginated", params] as const,
    queryFn: async () => {
      const res = await getBranchList(params);
      const items = (res.data?.branches ?? []).map(mapBranchFlatToData);
      const total = res.data?.metadata?.total ?? items.length;
      return { items, total };
    },
    placeholderData: EMPTY_BRANCH_PAGE,
  });
}

export function useBranchTree() {
  return useQuery({
    queryKey: branchKeys.tree(),
    queryFn: async () => {
      const res = await getBranchTree({ per_page: 100 });
      return flattenBranchTree(res.data?.branches ?? []);
    },
    placeholderData: [],
  });
}

export function useRegionalList(type?: string) {
  return useQuery({
    queryKey: [...branchKeys.regional(), { type }] as const,
    queryFn: async () => {
      const res = await listRegional({ per_page: 100, type });
      return res.data?.branches ?? [];
    },
    placeholderData: [],
  });
}

export function useAreaList(regionalId: string, type?: string) {
  return useQuery({
    queryKey: [...branchKeys.all, "area", regionalId, { type }] as const,
    queryFn: async () => {
      const res = await listArea(regionalId, { per_page: 100, type });
      return res.data?.branches ?? [];
    },
    enabled: !!regionalId,
    placeholderData: [],
  });
}

export function useSubAreaList(regionalId: string, areaId: string) {
  return useQuery({
    queryKey: [...branchKeys.all, "sub-area", regionalId, areaId] as const,
    queryFn: async () => {
      const res = await listSubArea(regionalId, areaId, { per_page: 100 });
      return res.data?.branches ?? [];
    },
    enabled: !!regionalId && !!areaId,
    placeholderData: [],
  });
}

export function useBranchDetail(branch: BranchData | null) {
  return useQuery({
    queryKey: [...branchKeys.all, "detail", branch?.id] as const,
    queryFn: async (): Promise<BranchData | null> => {
      if (!branch) return null;
      const res = await getBranchById(branch.id);
      if (!res.data) return null;
      return mapBranchDetailToData(res.data);
    },
    enabled: !!branch,
    retry: false,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      level,
      regionalId,
      areaId,
      payload,
    }: {
      level: "regional" | "area" | "sub_area";
      regionalId?: string;
      areaId?: string;
      payload: BranchPayload;
    }) => {
      if (level === "regional") return createRegional(payload);
      if (level === "area" && regionalId) return createArea(regionalId, payload);
      if (level === "sub_area" && regionalId && areaId)
        return createSubArea(regionalId, areaId, payload);
      throw new Error("Missing parent IDs for branch creation");
    },
    onSuccess: () => {
      toast.success("Branch created successfully");
      qc.invalidateQueries({ queryKey: branchKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        (err as Error)?.message ??
        "Failed to create branch";
      toast.error(msg);
    },
  });
}

export function useUpdateBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      level,
      id,
      regionalId,
      areaId,
      payload,
    }: {
      level: "regional" | "area" | "sub_area";
      id: string;
      regionalId?: string;
      areaId?: string;
      payload: BranchPayload;
    }) => {
      if (level === "regional") return updateRegional(id, payload);
      if (level === "area" && regionalId) return updateArea(regionalId, id, payload);
      if (level === "sub_area" && regionalId && areaId)
        return updateSubArea(regionalId, areaId, id, payload);
      throw new Error("Missing parent IDs for branch update");
    },
    onSuccess: () => {
      toast.success("Branch updated successfully");
      qc.invalidateQueries({ queryKey: branchKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        (err as Error)?.message ??
        "Failed to update branch";
      toast.error(msg);
    },
  });
}

export function useDeleteBranch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      level,
      id,
      regionalId,
      areaId,
    }: {
      level: "regional" | "area" | "sub_area";
      id: string;
      regionalId?: string;
      areaId?: string;
    }) => {
      if (level === "regional") return deleteRegional(id);

      // Flat list doesn't carry parent IDs — fetch detail to resolve them
      let resolvedRegionalId = regionalId;
      let resolvedAreaId = areaId;
      if (!resolvedRegionalId || (level === "sub_area" && !resolvedAreaId)) {
        const detail = await getBranchById(id);
        resolvedRegionalId = detail.data?.branch_regional?.id ?? resolvedRegionalId;
        resolvedAreaId = detail.data?.branch_area?.id ?? resolvedAreaId;
      }

      if (level === "area" && resolvedRegionalId)
        return deleteArea(resolvedRegionalId, id);
      if (level === "sub_area" && resolvedRegionalId && resolvedAreaId)
        return deleteSubArea(resolvedRegionalId, resolvedAreaId, id);

      throw new Error("Missing parent IDs for branch delete");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: branchKeys.all });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        (err as Error)?.message ??
        "Failed to delete branch";
      toast.error(msg);
    },
  });
}
