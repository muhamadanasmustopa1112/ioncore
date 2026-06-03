import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CPQ_KEYS } from "./keys";
import type { CreateBoqPayload } from "../types/cpq";

function simulateCreateBoq(payload: CreateBoqPayload) {
  return new Promise<{ id: string }>((resolve) => {
    setTimeout(() => resolve({ id: `boq-${Date.now()}` }), 500);
  });
}

export function useCreateBoq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBoqPayload) => simulateCreateBoq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CPQ_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
    },
  });
}
