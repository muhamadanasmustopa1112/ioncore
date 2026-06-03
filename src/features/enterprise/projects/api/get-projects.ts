import { useQuery } from "@tanstack/react-query";
import { DUMMY_PROJECTS } from "../data/dummy-projects";
import type { ProjectListData, ProjectListParams } from "../types/project";
import { PROJECT_KEYS } from "./keys";

function filterProjects(params: ProjectListParams): ProjectListData {
  let filtered = [...DUMMY_PROJECTS];

  if (params.name) {
    const search = params.name.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.project_name.toLowerCase().includes(search) ||
        p.customer_name.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((p) => p.status === params.status);
  }

  if (params.project_type) {
    filtered = filtered.filter((p) => p.project_type === params.project_type);
  }

  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const start = (page - 1) * per_page;
  const paginated = filtered.slice(start, start + per_page);

  return {
    projects: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useProjects(params: ProjectListParams = {}) {
  return useQuery<ProjectListData>({
    queryKey: PROJECT_KEYS.list(params),
    queryFn: () => filterProjects(params),
  });
}
