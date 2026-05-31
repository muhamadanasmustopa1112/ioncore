import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { INVOICE_KEYS } from "./keys";
import { toast } from "sonner";

export function useDeleteInvoice({
  mutationConfig,
}: {
  mutationConfig?: {
    onSuccess?: () => void;
  };
} = {}) {
  const queryClient = getQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: { id } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVOICE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      toast.success("Invoice deleted successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete invoice");
    },
    ...restConfig,
  });
}
