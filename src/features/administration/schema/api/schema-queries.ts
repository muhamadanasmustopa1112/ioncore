import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  listSchemas,
  getSchema,
  createSchema,
  updateSchemaContent,
  listSchemaVersions,
  publishSchemaVersion,
  cloneSchemaVersion,
  getSchemaVersionDiff,
  rollbackSchemaVersion,
  getSchemaTypes,
  submitForReview,
  addApprovalDecision,
  getVersionApproval,
  listApprovalDecisions,
  CreateSchemaPayload,
  UpdateSchemaContentPayload,
  SchemaListParams,
  CloneVersionPayload,
  RollbackPayload,
  SchemaListData,
  SchemaApprovalRecord,
  SchemaApprovalDecisionRecord,
  SubmitForReviewPayload,
  AddDecisionPayload,
} from "./schema-api";
import { SchemaRecord, SchemaVersion } from "../types";
import { useSchemaStore } from "../store/schema";

export const schemaKeys = {
  all: ["schemas"] as const,
  list: (params: SchemaListParams) => [...schemaKeys.all, "list", params] as const,
  detail: (id: string) => [...schemaKeys.all, "detail", id] as const,
  versions: (id: string) => [...schemaKeys.all, "versions", id] as const,
  diff: (id: string, v1: string, v2: string) =>
    [...schemaKeys.all, "diff", id, v1, v2] as const,
};

export function useSchemaList(params: SchemaListParams = {}) {
  return useQuery<SchemaListData>({
    queryKey: schemaKeys.list(params),
    queryFn: async () => {
      const res = await listSchemas(params);
      return res.data;
    },
  });
}

export function useSchema(id: string | null) {
  return useQuery<SchemaRecord | null>({
    queryKey: schemaKeys.detail(id!),
    queryFn: async () => {
      const res = await getSchema(id!);
      return res.data ?? null;
    },
    enabled: !!id,
  });
}

export function useSchemaVersions(id: string | null) {
  return useQuery<SchemaVersion[]>({
    queryKey: schemaKeys.versions(id!),
    queryFn: async () => {
      const res = await listSchemaVersions(id!);
      return res.data.schema_versions ?? [];
    },
    enabled: !!id,
  });
}

export function useSchemaTypes() {
  return useQuery<string[]>({
    queryKey: ["schema-types"],
    queryFn: async () => {
      const res = await getSchemaTypes();
      return res.data ?? [];
    },
    staleTime: Infinity,
  });
}

export function useSchemaVersionDiff(
  id: string | null,
  version: string,
  targetVersion: string
) {
  return useQuery({
    queryKey: schemaKeys.diff(id!, version, targetVersion),
    queryFn: () => getSchemaVersionDiff(id!, version, targetVersion),
    enabled: !!id && !!version && !!targetVersion,
  });
}

export function useCreateSchema() {
  const qc = useQueryClient();
  const { closeSchemaSheet } = useSchemaStore();
  return useMutation({
    mutationFn: async (payload: CreateSchemaPayload) => {
      const res = await createSchema(payload);
      const schemaId = res.data?.id;
      if (schemaId && payload.content && Object.keys(payload.content).length > 0) {
        await updateSchemaContent(schemaId, { content: payload.content, change_reason: payload.change_reason });
      }
      return res;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      closeSchemaSheet();
      toast.success("Schema created.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to create schema.");
    },
  });
}

export function useUpdateSchemaContent() {
  const qc = useQueryClient();
  const { closeSchemaSheet } = useSchemaStore();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSchemaContentPayload }) =>
      updateSchemaContent(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: schemaKeys.detail(id) });
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      closeSchemaSheet();
      toast.success("Schema draft saved.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to save schema.");
    },
  });
}

export function usePublishSchemaVersion() {
  const qc = useQueryClient();
  const { closeApprovalPanel } = useSchemaStore();
  return useMutation({
    mutationFn: (versionId: string) => publishSchemaVersion(versionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      closeApprovalPanel();
      toast.success("Schema published.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to publish.");
    },
  });
}

export function useCloneSchemaVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      versionId,
      payload,
    }: {
      versionId: string;
      payload: CloneVersionPayload;
    }) => cloneSchemaVersion(versionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      toast.success("Schema cloned.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to clone.");
    },
  });
}

export function useRollbackSchemaVersion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RollbackPayload }) =>
      rollbackSchemaVersion(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      toast.success("Rolled back.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to rollback.");
    },
  });
}

export function useVersionApproval(versionId: string | null) {
  return useQuery<SchemaApprovalRecord | null>({
    queryKey: ["schema-approval", versionId],
    queryFn: async () => {
      const res = await getVersionApproval(versionId!);
      return res.data ?? null;
    },
    enabled: !!versionId,
  });
}

export function useApprovalDecisions(approvalId: string | null) {
  return useQuery<SchemaApprovalDecisionRecord[]>({
    queryKey: ["schema-approval-decisions", approvalId],
    queryFn: async () => {
      const res = await listApprovalDecisions(approvalId!);
      return res.data?.decisions ?? [];
    },
    enabled: !!approvalId,
  });
}

export function useSubmitForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: string; payload: SubmitForReviewPayload }) =>
      submitForReview(versionId, payload),
    onSuccess: (_, { versionId }) => {
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      qc.invalidateQueries({ queryKey: ["schema-approval", versionId] });
      toast.success("Submitted for review.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to submit for review.");
    },
  });
}

export function useAddApprovalDecision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: string; payload: AddDecisionPayload }) =>
      addApprovalDecision(versionId, payload),
    onSuccess: (data) => {
      const approvalId = data.data?.schema_approval_id;
      if (approvalId) qc.invalidateQueries({ queryKey: ["schema-approval-decisions", approvalId] });
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      toast.success("Decision submitted.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to submit decision.");
    },
  });
}
