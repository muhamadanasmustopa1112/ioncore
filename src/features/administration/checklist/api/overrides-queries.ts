import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Override } from "../types/overrides";
import type { OverrideDto, OverridePayload } from "../types/overrides-api";
import {
  listOverrides,
  getOverride,
  createOverride,
  updateOverride,
  deleteOverride,
  approveOverride,
  archiveOverride,
} from "./overrides-api";

export const overrideKeys = {
  all: ["checklist-overrides"] as const,
  list: (params?: object) => [...overrideKeys.all, "list", params] as const,
  detail: (id: string) => [...overrideKeys.all, id] as const,
};

function mapOverride(dto: OverrideDto): Override {
  return {
    id: dto.id,
    scopeType: dto.scope_type,
    scopeRefId: dto.scope_ref_id,
    scopeRefName: dto.scope_ref_name,
    baseTemplateId: dto.base_template_id,
    baseTemplateName: dto.base_template_name,
    exceptionRules: (dto.exception_rules ?? []).map((r) => ({
      id: r.id,
      stepId: r.step_id,
      stepTitle: r.step_title,
      captureId: r.capture_id,
      captureLabel: r.capture_label,
      action: r.action,
      newLabel: r.new_label,
      newSignerRole: r.new_signer_role,
      reason: r.reason,
    })),
    validFrom: dto.valid_from,
    validUntil: dto.valid_until,
    status: dto.status,
    approvedBy: dto.approved_by,
    approvedByName: dto.approved_by_name,
    approvedAt: dto.approved_at,
    createdBy: dto.created_by,
    createdByName: dto.created_by_name,
    createdAt: dto.created_at,
  };
}

export function useOverrideList(params?: { status?: string }) {
  return useQuery({
    queryKey: overrideKeys.list(params),
    queryFn: async () => {
      const res = await listOverrides(params);
      return (res.data?.overrides ?? []).map(mapOverride);
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useOverrideDetail(id: string) {
  return useQuery({
    queryKey: overrideKeys.detail(id),
    queryFn: async () => {
      const res = await getOverride(id);
      if (!res.data) throw new Error("Not found");
      return mapOverride(res.data);
    },
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useCreateOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: OverridePayload) => createOverride(payload),
    onSuccess: () => {
      toast.success("Override created");
      qc.invalidateQueries({ queryKey: overrideKeys.all });
    },
    onError: () => toast.error("Failed to create override"),
  });
}

export function useUpdateOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<OverridePayload> }) =>
      updateOverride(id, payload),
    onSuccess: () => {
      toast.success("Override updated");
      qc.invalidateQueries({ queryKey: overrideKeys.all });
    },
    onError: () => toast.error("Failed to update override"),
  });
}

export function useDeleteOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOverride(id),
    onSuccess: () => {
      toast.success("Override deleted");
      qc.invalidateQueries({ queryKey: overrideKeys.all });
    },
    onError: () => toast.error("Failed to delete override"),
  });
}

export function useApproveOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveOverride(id),
    onSuccess: () => {
      toast.success("Override approved");
      qc.invalidateQueries({ queryKey: overrideKeys.all });
    },
    onError: () => toast.error("Failed to approve override"),
  });
}

export function useArchiveOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveOverride(id),
    onSuccess: () => {
      toast.success("Override archived");
      qc.invalidateQueries({ queryKey: overrideKeys.all });
    },
    onError: () => toast.error("Failed to archive override"),
  });
}
