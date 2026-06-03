import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_PROJECTS } from "../data/dummy-projects";
import type { CreateProjectPayload, Project } from "../types/project";
import { PROJECT_KEYS } from "./keys";

export function useUpdateProject() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateProjectPayload }): Promise<{ data: Project }> => {
      const idx = DUMMY_PROJECTS.findIndex((p) => p.id === id);
      if (idx === -1) return Promise.reject(new Error("Not found"));
      DUMMY_PROJECTS[idx] = { ...DUMMY_PROJECTS[idx], ...payload, updated_at: new Date().toISOString() };
      return Promise.resolve({ data: DUMMY_PROJECTS[idx] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Project updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update project.");
    },
  });
}
