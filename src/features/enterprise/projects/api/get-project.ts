import { useQuery } from "@tanstack/react-query";
import { DUMMY_PROJECTS, DUMMY_S_CURVE } from "../data/dummy-projects";
import type { Project, SCurveDataPoint } from "../types/project";
import { PROJECT_KEYS } from "./keys";

export function useProject(id: string | null) {
  return useQuery<Project | null>({
    queryKey: PROJECT_KEYS.detail(id!),
    queryFn: () => DUMMY_PROJECTS.find((p) => p.id === id) ?? null,
    enabled: !!id,
  });
}

export function useProjectSCurve(id: string | null) {
  return useQuery<SCurveDataPoint[]>({
    queryKey: PROJECT_KEYS.sCurve(id!),
    queryFn: () => DUMMY_S_CURVE,
    enabled: !!id,
  });
}
