import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { SchemaVersion } from "../types/versioning";
import type { SchemaVersionDto } from "../types/versioning-api";
import {
  approveVersion,
  archiveVersion,
  cloneVersionAsDraft,
  listVersions,
  publishVersion,
  rejectVersion,
  submitForApproval,
} from "./versioning-api";

export const versioningKeys = {
  all: ["checklist-versions"] as const,
  byTemplate: (templateId: string) => [...versioningKeys.all, templateId] as const,
};

function mapVersion(dto: SchemaVersionDto): SchemaVersion {
  return {
    id: dto.id,
    templateId: dto.template_id,
    versionNumber: dto.version_number,
    status: dto.status,
    createdBy: dto.created_by,
    createdByName: dto.created_by_name,
    createdAt: dto.created_at,
    publishedBy: dto.published_by,
    publishedByName: dto.published_by_name,
    publishedAt: dto.published_at,
    changeReason: dto.change_reason,
    approvalChain: (dto.approval_chain ?? []).map((a) => ({
      approverId: a.approver_id,
      approverName: a.approver_name,
      approverRole: a.approver_role,
      approvedAt: a.approved_at,
      approvalNotes: a.approval_notes,
      status: a.status,
    })),
  };
}

export function useVersionList(templateId: string) {
  return useQuery({
    queryKey: versioningKeys.byTemplate(templateId),
    queryFn: async () => {
      const res = await listVersions(templateId);
      return (res.data?.versions ?? []).map(mapVersion);
    },
    enabled: !!templateId,
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useSubmitForApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId, changeReason }: { templateId: string; versionId: string; changeReason: string }) =>
      submitForApproval(templateId, versionId, changeReason),
    onSuccess: (_, { templateId }) => {
      toast.success("Submitted for approval");
      qc.invalidateQueries({ queryKey: versioningKeys.byTemplate(templateId) });
    },
    onError: () => toast.error("Failed to submit for approval"),
  });
}

export function useApproveVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId, notes }: { templateId: string; versionId: string; notes?: string }) =>
      approveVersion(templateId, versionId, notes),
    onSuccess: (_, { templateId }) => {
      toast.success("Version approved");
      qc.invalidateQueries({ queryKey: versioningKeys.byTemplate(templateId) });
    },
    onError: () => toast.error("Failed to approve version"),
  });
}

export function useRejectVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId, reason }: { templateId: string; versionId: string; reason: string }) =>
      rejectVersion(templateId, versionId, reason),
    onSuccess: (_, { templateId }) => {
      toast.success("Version rejected");
      qc.invalidateQueries({ queryKey: versioningKeys.byTemplate(templateId) });
    },
    onError: () => toast.error("Failed to reject version"),
  });
}

export function usePublishVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId, changeReason }: { templateId: string; versionId: string; changeReason: string }) =>
      publishVersion(templateId, versionId, changeReason),
    onSuccess: (_, { templateId }) => {
      toast.success("Version published");
      qc.invalidateQueries({ queryKey: versioningKeys.byTemplate(templateId) });
    },
    onError: () => toast.error("Failed to publish version"),
  });
}

export function useArchiveVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId }: { templateId: string; versionId: string }) =>
      archiveVersion(templateId, versionId),
    onSuccess: (_, { templateId }) => {
      toast.success("Version archived");
      qc.invalidateQueries({ queryKey: versioningKeys.byTemplate(templateId) });
    },
    onError: () => toast.error("Failed to archive version"),
  });
}

export function useCloneVersionAsDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ templateId, versionId }: { templateId: string; versionId: string }) =>
      cloneVersionAsDraft(templateId, versionId),
    onSuccess: (_, { templateId }) => {
      toast.success("Draft created from version");
      qc.invalidateQueries({ queryKey: versioningKeys.byTemplate(templateId) });
    },
    onError: () => toast.error("Failed to create draft"),
  });
}
