import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { INVOICE_KEYS } from "./keys";
import { toast } from "sonner";
import { z } from "zod/v4";

const invoiceLineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  customerName: z.string().min(1, "Customer name is required"),
  customerType: z.enum(["broadband", "business"]),
  type: z.enum(["otc", "recurring", "addon"]),
  dueDate: z.string().min(1, "Due date is required"),
  branch: z.string().min(1, "Branch is required"),
  notes: z.string().optional(),
  billingSchemaVersion: z.string().min(1, "Schema version is required"),
  lineItems: z
    .array(invoiceLineItemSchema)
    .min(1, "At least one line item is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

export function useCreateInvoice({
  mutationConfig,
}: {
  mutationConfig?: {
    onSuccess?: () => void;
  };
} = {}) {
  const queryClient = getQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { data: { id: `INV-${Date.now()}`, ...data } };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INVOICE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      toast.success("Invoice created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create invoice");
    },
    ...restConfig,
  });
}
