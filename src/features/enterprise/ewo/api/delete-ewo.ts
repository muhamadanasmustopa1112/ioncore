import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_EWOS } from "../data/dummy-ewos";
import { EWO_KEYS } from "./keys";

export function useDeleteEwo() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const index = DUMMY_EWOS.findIndex((e) => e.id === id);
      if (index !== -1) DUMMY_EWOS.splice(index, 1);
      return Promise.resolve({ data: null });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EWO_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("EWO deleted successfully.");
    },
    onError: () => {
      toast.error("Failed to delete EWO.");
    },
  });
}
