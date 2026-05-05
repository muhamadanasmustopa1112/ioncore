export const ruleSchemaKeys = {
  all: ["rule-schema"] as const,

  types: () => [...ruleSchemaKeys.all, "types"] as const,

  branches: (params?: unknown) =>
    [...ruleSchemaKeys.all, "branches", params] as const,

  schemas: (params?: unknown) =>
    [...ruleSchemaKeys.all, "schemas", params] as const,
  schema: (id: string) =>
    [...ruleSchemaKeys.all, "schemas", id] as const,

  versions: (schemaId: string, params?: unknown) =>
    [...ruleSchemaKeys.all, "schemas", schemaId, "versions", params] as const,
  version: (versionId: string) =>
    [...ruleSchemaKeys.all, "versions", versionId] as const,

  customerOverrides: (params?: unknown) =>
    [...ruleSchemaKeys.all, "customer-overrides", params] as const,
  customerOverride: (id: string) =>
    [...ruleSchemaKeys.all, "customer-overrides", id] as const,
  customerOverrideDiff: (id: string) =>
    [...ruleSchemaKeys.all, "customer-overrides", id, "content-diff"] as const,
};
