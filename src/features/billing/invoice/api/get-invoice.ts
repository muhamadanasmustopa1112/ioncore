import { useQuery, queryOptions } from "@tanstack/react-query";
import { INVOICE_KEYS } from "./keys";
import { dummyInvoices } from "../data/dummy-invoices";
import type { InvoiceDetailResponse } from "../types";

async function getInvoice(id: string): Promise<InvoiceDetailResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const invoice = dummyInvoices.find((inv) => inv.id === id);
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  return { data: invoice };
}

export const getInvoiceQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: INVOICE_KEYS.detail(id),
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
};

export function useInvoice({ id }: { id: string }) {
  return useQuery(getInvoiceQueryOptions(id));
}
