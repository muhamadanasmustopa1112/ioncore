import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CPQ_KEYS } from "./keys";
import type { CreateQuotationPayload } from "../types/cpq";

function simulateCreateQuotation(payload: CreateQuotationPayload) {
  return new Promise<{ id: string }>((resolve) => {
    setTimeout(() => resolve({ id: `qt-${Date.now()}` }), 500);
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuotationPayload) => simulateCreateQuotation(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CPQ_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
    },
  });
}
