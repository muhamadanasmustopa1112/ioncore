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

  customerSchemas: (params?: unknown) =>
    [...ruleSchemaKeys.all, "customer-schemas", params] as const,
  customerSchema: (id: string) =>
    [...ruleSchemaKeys.all, "customer-schemas", id] as const,

  // Legacy aliases
  customerOverrides: (params?: unknown) =>
    [...ruleSchemaKeys.all, "customer-schemas", params] as const,
  customerOverride: (id: string) =>
    [...ruleSchemaKeys.all, "customer-schemas", id] as const,
  customerOverrideDiff: (id: string) =>
    [...ruleSchemaKeys.all, "customer-schemas", id, "content-diff"] as const,

  broadbandPlanSchemas: (params?: unknown) =>
    [...ruleSchemaKeys.all, "broadband-plan-schemas", params] as const,
  broadbandPlanSchema: (id: string) =>
    [...ruleSchemaKeys.all, "broadband-plan-schemas", id] as const,
};
