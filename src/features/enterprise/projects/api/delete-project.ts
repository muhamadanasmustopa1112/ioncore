import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_PROJECTS } from "../data/dummy-projects";
import { PROJECT_KEYS } from "./keys";

export function useDeleteProject() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const index = DUMMY_PROJECTS.findIndex((p) => p.id === id);
      if (index !== -1) DUMMY_PROJECTS.splice(index, 1);
      return Promise.resolve({ data: null });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECT_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("Project deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete project.");
    },
  });
}
