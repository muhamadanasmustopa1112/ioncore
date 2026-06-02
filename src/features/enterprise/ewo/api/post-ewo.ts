import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getQueryClient } from "@/lib/get-query-client";
import { DUMMY_EWOS } from "../data/dummy-ewos";
import type { CreateEwoPayload, Ewo } from "../types/ewo";
import { EWO_KEYS } from "./keys";

export function useCreateEwo() {
  const qc = getQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEwoPayload): Promise<{ data: Ewo }> => {
      const now = new Date().toISOString();
      const newEwo: Ewo = {
        id: `ewo-${String(DUMMY_EWOS.length + 1).padStart(3, "0")}`,
        ewo_number: `EWO-${new Date().getFullYear()}-${String(DUMMY_EWOS.length + 1).padStart(3, "0")}`,
        ...payload,
        status: "draft",
        lines: [],
        status_history: [
          { id: `sh-new-${Date.now()}`, from_status: null, to_status: "draft", changed_by: "System", changed_at: now },
        ],
        created_at: now,
        updated_at: now,
      };
      DUMMY_EWOS.push(newEwo);
      return Promise.resolve({ data: newEwo });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EWO_KEYS.all(), exact: false, refetchType: "active" });
      toast.success("EWO created successfully.");
    },
    onError: () => {
      toast.error("Failed to create EWO.");
    },
  });
}
