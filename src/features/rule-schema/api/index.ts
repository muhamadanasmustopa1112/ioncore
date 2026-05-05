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
    `${base}/schemas/types`,
  );

export const listSchemas = (params?: ListSchemasParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaListData>>(
    `${base}/schemas/`,
    { params },
  );

export const getSchema = (id: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<Schema>>(
    `${base}/schemas/${id}`,
  );

export const createSchema = (payload: CreateSchemaRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<Schema>>(
    `${base}/schemas`,
    payload,
  );

export const updateSchemaContent = (id: string, payload: UpdateSchemaContentRequest) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/schemas/${id}/content`,
    payload,
  );

export const listSchemaVersions = (schemaId: string, params?: ListSchemaVersionsParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaVersionListData>>(
    `${base}/schemas/${schemaId}/versions`,
    { params },
  );

export const getSchemaVersion = (versionId: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/schema-versions/${versionId}`,
  );

export const createSchemaVersion = (schemaId: string, payload: CreateSchemaVersionRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/schemas/${schemaId}/versions`,
    payload,
  );

export const updateSchemaVersion = (versionId: string, payload: UpdateSchemaVersionRequest) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/schema-versions/${versionId}`,
    payload,
  );

export const publishSchemaVersion = (versionId: string) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<null>>(
    `${base}/schema-versions/${versionId}/publish`,
  );

export const cloneSchemaVersion = (versionId: string, payload: CloneSchemaVersionRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<SchemaVersion>>(
    `${base}/schema-versions/${versionId}/clone`,
    payload,
  );

export const diffSchemaVersions = (schemaId: string, params: DiffVersionsParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<SchemaDiffData>>(
    `${base}/schemas/${schemaId}/versions/diff`,
    { params },
  );

export const rollbackSchemaVersion = (schemaId: string, payload: RollbackVersionRequest) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<null>>(
    `${base}/schemas/${schemaId}/versions/rollback`,
    payload,
  );

export const evaluateSchema = (versionId: string, payload: EvaluateSchemaRequest) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<EvaluateResult>>(
    `${base}/schema-versions/${versionId}/evaluate`,
    payload,
  );

// ── Safe empty placeholders ─────────────────────────────

const EMPTY_META = { page: 1, size: 10, total: 0 };

const EMPTY_SCHEMA_TYPES: RuleSchemaEnvelope<SchemaType[]> = {
  data: [], error: "", message: "", metadata: null,
};
const EMPTY_SCHEMAS: RuleSchemaEnvelope<SchemaListData> = {
  data: { schemas: [], metadata: EMPTY_META }, error: "", message: "", metadata: null,
};
const EMPTY_SCHEMA_VERSIONS: RuleSchemaEnvelope<SchemaVersionListData> = {
  data: { schema_versions: [], metadata: EMPTY_META }, error: "", message: "", metadata: null,
};
const EMPTY_DIFF: RuleSchemaEnvelope<SchemaDiffData> = {
  data: { schema_versions: [] }, error: "", message: "", metadata: null,
};

// ── Hooks ───────────────────────────────────────────────

export const useSchemaTypes = () =>
  useQuery({
    queryKey: ruleSchemaKeys.types(),
    queryFn: async () => {
      try { return await getSchemaTypes(); } catch { return EMPTY_SCHEMA_TYPES; }
    },
    staleTime: Infinity,
    placeholderData: EMPTY_SCHEMA_TYPES,
    retry: false,
  });

export const useSchemas = (params?: ListSchemasParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.schemas(params),
    queryFn: async () => {
      try { return await listSchemas(params); } catch { return EMPTY_SCHEMAS; }
    },
    placeholderData: EMPTY_SCHEMAS,
    retry: false,
  });

export const useSchema = (id: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.schema(id),
    queryFn: async () => {
      try { return await getSchema(id); } catch { return null; }
    },
    enabled: !!id,
    retry: false,
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
    queryFn: async () => {
      try { return await listSchemaVersions(schemaId, params); } catch { return EMPTY_SCHEMA_VERSIONS; }
    },
    enabled: !!schemaId,
    placeholderData: EMPTY_SCHEMA_VERSIONS,
    retry: false,
  });

export const useSchemaVersion = (versionId: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.version(versionId),
    queryFn: async () => {
      try { return await getSchemaVersion(versionId); } catch { return null; }
    },
    enabled: !!versionId,
    retry: false,
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
    queryFn: async () => {
      try { return await diffSchemaVersions(schemaId, params!); } catch { return EMPTY_DIFF; }
    },
    enabled: !!schemaId && !!params?.version && !!params?.target_version,
    placeholderData: EMPTY_DIFF,
    retry: false,
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

export * from "./customer-overrides-api";
