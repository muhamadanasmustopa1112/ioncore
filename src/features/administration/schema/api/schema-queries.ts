import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
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

const invalidateSchemaDetail = (qc: QueryClient, schemaId?: string | null) => {
  if (!schemaId) return;
  qc.invalidateQueries({ queryKey: schemaKeys.detail(schemaId) });
  qc.invalidateQueries({ queryKey: schemaKeys.versions(schemaId) });
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
    placeholderData: [],
  });
}

export function useSchemaTypes() {
  return useQuery<string[]>({
    queryKey: ["schema-types"],
    queryFn: async () => {
      const res = await getSchemaTypes();
      return res.data ?? [];
    },
    placeholderData: [],
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
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSchemaContentPayload }) =>
      updateSchemaContent(id, payload),
    onSuccess: (_, { id }) => {
      invalidateSchemaDetail(qc, id);
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      const store = useSchemaStore.getState();
      if (store.pendingApproval) {
        store.closeSchemaSheet();
        store.openApprovalPanel(id);
        toast.success("Draft saved. Opening approval panel...");
      } else {
        store.closeSchemaSheet();
        toast.success("Schema draft saved.");
      }
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
      const selectedSchemaId = useSchemaStore.getState().selectedSchemaId;
      invalidateSchemaDetail(qc, selectedSchemaId);
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
      const selectedSchemaId = useSchemaStore.getState().selectedSchemaId;
      invalidateSchemaDetail(qc, selectedSchemaId);
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
      invalidateSchemaDetail(qc, useSchemaStore.getState().selectedSchemaId);
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
      try {
        const res = await getVersionApproval(versionId!);
        return res.data ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!versionId,
    retry: false,
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
    placeholderData: [],
  });
}

export function useSubmitForReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: string; payload: SubmitForReviewPayload }) =>
      submitForReview(versionId, payload),
    onMutate: ({ versionId }) => {
      const selectedSchemaId = useSchemaStore.getState().selectedSchemaId;
      if (!selectedSchemaId) return;
      qc.setQueryData<SchemaVersion[]>(schemaKeys.versions(selectedSchemaId), (prev = []) =>
        prev.map((v) => (v.id === versionId ? { ...v, status: "SUBMITTED" } : v))
      );
    },
    onSuccess: (_, { versionId }) => {
      const selectedSchemaId = useSchemaStore.getState().selectedSchemaId;
      invalidateSchemaDetail(qc, selectedSchemaId);
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
    onMutate: ({ versionId, payload }) => {
      // Optimistically assume the version status updates immediately when approved/rejected
      const selectedSchemaId = useSchemaStore.getState().selectedSchemaId;
      if (selectedSchemaId) {
        qc.setQueryData<SchemaVersion[]>(schemaKeys.versions(selectedSchemaId), (prev = []) =>
          prev.map((v) => {
            if (v.id === versionId) {
              const newStatus = payload.decision.toUpperCase();
              // In a real flow, it might still need more approvals, so don't force 'APPROVED'
              // unless it's REJECTED which is usually instant. Let's avoid forceful optimistic
              // status change except putting it deeply into pending UI if needed.
              return v;
            }
            return v;
          })
        );
      }
    },
    onSuccess: (data, { versionId, payload }) => {
      const decision = data.data;
      const approvalId = decision?.schema_approval_id;
      if (approvalId) {
        qc.setQueryData<SchemaApprovalDecisionRecord[]>(
          ["schema-approval-decisions", approvalId],
          (prev = []) => {
            if (!decision) return prev;
            if (prev.some((d) => d.id === decision.id)) return prev;
            return [...prev, decision];
          }
        );
        qc.invalidateQueries({ queryKey: ["schema-approval-decisions", approvalId] });
      }
      
      const isApproved = payload?.decision?.toUpperCase() === "APPROVED";
      const isRejected = payload?.decision?.toUpperCase() === "REJECTED";
      const selectedSchemaId = useSchemaStore.getState().selectedSchemaId;
      
      // Optimistically put the version into APPROVED or REJECTED state immediately 
      // instead of relying on the backend to propagate the event quickly.
      // This prevents the UI from bouncing back to "Submit for Review".
      if (selectedSchemaId) {
        qc.setQueryData<SchemaVersion[]>(schemaKeys.versions(selectedSchemaId), (prev = []) =>
          prev.map((v) => (v.id === versionId ? { 
            ...v, 
            status: isApproved ? "APPROVED" : isRejected ? "REJECTED" : v.status 
          } : v))
        );
      }

      qc.invalidateQueries({ queryKey: ["schema-approval-decisions"] });
      qc.invalidateQueries({ queryKey: ["schema-approval", versionId] });
      invalidateSchemaDetail(qc, selectedSchemaId);
      qc.invalidateQueries({ queryKey: schemaKeys.all });
      toast.success("Decision submitted.");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to submit decision.");
    },
  });
}
