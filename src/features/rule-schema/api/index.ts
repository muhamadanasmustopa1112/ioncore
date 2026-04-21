import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { ruleSchemaKeys } from "./keys";
import type {
  CloneSchemaVersionRequest,
  CreateSchemaRequest,
  CreateSchemaVersionRequest,
  DiffVersionsParams,
  EvaluateSchemaRequest,
  EvaluateResult,
  ListSchemasParams,
  ListSchemaVersionsParams,
  RollbackVersionRequest,
  RuleSchemaEnvelope,
  Schema,
  SchemaListData,
  SchemaDiffData,
  SchemaType,
  SchemaVersion,
  SchemaVersionListData,
  UpdateSchemaContentRequest,
  UpdateSchemaVersionRequest,
} from "../types";

const base = services.ruleScheme;

// ── API functions ───────────────────────────────────────

export const getSchemaTypes = () =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaType[]>>(
    `${base}/v1/schemas/types`,
  );

export const listSchemas = (params?: ListSchemasParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaListData>>(
    `${base}/v1/schemas/`,
    { params },
  );

export const getSchema = (id: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<Schema>>(
    `${base}/v1/schemas/${id}`,
  );

export const createSchema = (payload: CreateSchemaRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<Schema>>(
    `${base}/v1/schemas`,
    payload,
  );

export const updateSchemaContent = (id: string, payload: UpdateSchemaContentRequest) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/v1/schemas/${id}/content`,
    payload,
  );

export const listSchemaVersions = (schemaId: string, params?: ListSchemaVersionsParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaVersionListData>>(
    `${base}/v1/schemas/${schemaId}/versions`,
    { params },
  );

export const getSchemaVersion = (versionId: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/v1/schema-versions/${versionId}`,
  );

export const createSchemaVersion = (schemaId: string, payload: CreateSchemaVersionRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/v1/schemas/${schemaId}/versions`,
    payload,
  );

export const updateSchemaVersion = (versionId: string, payload: UpdateSchemaVersionRequest) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/v1/schema-versions/${versionId}`,
    payload,
  );

export const publishSchemaVersion = (versionId: string) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<null>>(
    `${base}/v1/schema-versions/${versionId}/publish`,
  );

export const cloneSchemaVersion = (versionId: string, payload: CloneSchemaVersionRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/v1/schema-versions/${versionId}/clone`,
    payload,
  );

export const diffSchemaVersions = (schemaId: string, params: DiffVersionsParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaDiffData>>(
    `${base}/v1/schemas/${schemaId}/versions/diff`,
    { params },
  );

export const rollbackSchemaVersion = (schemaId: string, payload: RollbackVersionRequest) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<null>>(
    `${base}/v1/schemas/${schemaId}/versions/rollback`,
    payload,
  );

export const evaluateSchema = (versionId: string, payload: EvaluateSchemaRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<EvaluateResult>>(
    `${base}/v1/schema-versions/${versionId}/evaluate`,
    payload,
  );

// ── Hooks ───────────────────────────────────────────────

export const useSchemaTypes = () =>
  useQuery({
    queryKey: ruleSchemaKeys.types(),
    queryFn: () => getSchemaTypes(),
    staleTime: Infinity,
  });

export const useSchemas = (params?: ListSchemasParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.schemas(params),
    queryFn: () => listSchemas(params),
  });

export const useSchema = (id: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.schema(id),
    queryFn: () => getSchema(id),
    enabled: !!id,
  });

export const useCreateSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSchemaRequest) => createSchema(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ruleSchemaKeys.schemas() }),
  });
};

export const useUpdateSchemaContent = (id: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSchemaContentRequest) => updateSchemaContent(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.schema(id) });
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.versions(id) });
    },
  });
};

export const useSchemaVersions = (schemaId: string, params?: ListSchemaVersionsParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.versions(schemaId, params),
    queryFn: () => listSchemaVersions(schemaId, params),
    enabled: !!schemaId,
  });

export const useSchemaVersion = (versionId: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.version(versionId),
    queryFn: () => getSchemaVersion(versionId),
    enabled: !!versionId,
  });

export const useCreateSchemaVersion = (schemaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSchemaVersionRequest) =>
      createSchemaVersion(schemaId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.versions(schemaId) }),
  });
};

export const useUpdateSchemaVersion = (schemaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: string; payload: UpdateSchemaVersionRequest }) =>
      updateSchemaVersion(versionId, payload),
    onSuccess: (_, { versionId }) => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.version(versionId) });
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.versions(schemaId) });
    },
  });
};

export const usePublishSchemaVersion = (schemaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (versionId: string) => publishSchemaVersion(versionId),
    onSuccess: (_, versionId) => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.version(versionId) });
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.versions(schemaId) });
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.schema(schemaId) });
    },
  });
};

export const useCloneSchemaVersion = (schemaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ versionId, payload }: { versionId: string; payload: CloneSchemaVersionRequest }) =>
      cloneSchemaVersion(versionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.schemas() });
    },
  });
};

export const useDiffSchemaVersions = (schemaId: string, params?: DiffVersionsParams) =>
  useQuery({
    queryKey: [...ruleSchemaKeys.versions(schemaId), "diff", params] as const,
    queryFn: () => diffSchemaVersions(schemaId, params!),
    enabled: !!schemaId && !!params?.version && !!params?.target_version,
  });

export const useRollbackSchemaVersion = (schemaId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RollbackVersionRequest) => rollbackSchemaVersion(schemaId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.versions(schemaId) });
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.schema(schemaId) });
    },
  });
};

export const useEvaluateSchema = () =>
  useMutation({
    mutationFn: ({ versionId, payload }: { versionId: string; payload: EvaluateSchemaRequest }) =>
      evaluateSchema(versionId, payload),
  });
