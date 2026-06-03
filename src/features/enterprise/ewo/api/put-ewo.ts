import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_EWOS } from "../data/dummy-ewos";
import type { UpdateEwoPayload, Ewo } from "../types/ewo";
import { EWO_KEYS } from "./keys";

export function useUpdateEwo() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEwoPayload }): Promise<{ data: Ewo }> => {
      const index = DUMMY_EWOS.findIndex((e) => e.id === id);
      if (index === -1) throw new Error("EWO not found");
      const updated: Ewo = {
        ...DUMMY_EWOS[index],
        ...payload,
        updated_at: new Date().toISOString(),
      };
      DUMMY_EWOS[index] = updated;
      return Promise.resolve({ data: updated });
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: EWO_KEYS.detail(id), exact: false, refetchType: "active" });
      qc.invalidateQueries({ queryKey: EWO_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("EWO updated successfully.");
    },
    onError: () => {
      toast.error("Failed to update EWO.");
    },
  });
}
