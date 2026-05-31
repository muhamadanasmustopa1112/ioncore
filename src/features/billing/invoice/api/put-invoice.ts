import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { INVOICE_KEYS } from "./keys";
import { toast } from "sonner";
import type { InvoiceFormData } from "./post-invoice";

interface UpdateInvoiceVariables {
  id: string;
  data: Partial<InvoiceFormData>;
}

export function useUpdateInvoice({
  mutationConfig,
}: {
  mutationConfig?: {
    onSuccess?: () => void;
  };
} = {}) {
  const queryClient = getQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: async ({ id, data }: UpdateInvoiceVariables) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: { id, ...data } };
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: INVOICE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: INVOICE_KEYS.detail(variables.id),
      });
      toast.success("Invoice updated successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update invoice");
    },
    ...restConfig,
  });
}
