import type { ProjectListParams } from "../types/project";

export const PROJECT_KEYS = {
  all: () => ["PROJECTS"] as const,
  root: () => ["PROJECTS"] as const,
  list: (args?: ProjectListParams) => ["PROJECTS", "LIST", args || {}] as const,
  detail: (id: string) => ["PROJECTS", "DETAIL", id] as const,
  sCurve: (id: string) => ["PROJECTS", "S_CURVE", id] as const,
  create: () => ["PROJECTS", "CREATE"] as const,
  update: (id: string) => ["PROJECTS", "UPDATE", id] as const,
  delete: (id: string) => ["PROJECTS", "DELETE", id] as const,
};
