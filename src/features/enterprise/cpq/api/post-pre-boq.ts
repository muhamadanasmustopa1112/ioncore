import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CPQ_KEYS } from "./keys";
import type { CreatePreBoqPayload } from "../types/cpq";

function simulateCreatePreBoq(payload: CreatePreBoqPayload) {
  return new Promise<{ id: string }>((resolve) => {
    setTimeout(() => resolve({ id: `pbq-${Date.now()}` }), 500);
  });
}

export function useCreatePreBoq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePreBoqPayload) => simulateCreatePreBoq(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CPQ_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
    },
  });
}
