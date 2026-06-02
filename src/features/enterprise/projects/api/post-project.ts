import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_PROJECTS } from "../data/dummy-projects";
import type { CreateProjectPayload, Project } from "../types/project";
import { PROJECT_KEYS } from "./keys";

export function useCreateProject() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload): Promise<{ data: Project }> => {
      const newProject: Project = {
        id: `prj-${String(DUMMY_PROJECTS.length + 1).padStart(3, "0")}`,
        ...payload,
        services: [],
        multi_site: false,
        sites: [],
        milestones: [],
        vendors: [],
        linked_wo_ids: [],
        linked_invoice_ids: [],
        s_curve_health: "green",
        percent_planned: 0,
        percent_actual: 0,
        budget_total: 0,
        budget_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      DUMMY_PROJECTS.push(newProject);
      return Promise.resolve({ data: newProject });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Project created successfully.");
    },
    onError: () => {
      toast.error("Failed to create project.");
    },
  });
}
