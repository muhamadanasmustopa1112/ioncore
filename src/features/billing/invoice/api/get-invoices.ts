import { useQuery, queryOptions } from "@tanstack/react-query";
import { INVOICE_KEYS } from "./keys";
import { dummyInvoices } from "../data/dummy-invoices";
import type { InvoiceListResponse, InvoiceParams } from "../types";

async function getInvoices(params: InvoiceParams): Promise<InvoiceListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...dummyInvoices];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(search) ||
        inv.customerName.toLowerCase().includes(search) ||
        inv.branch.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((inv) => inv.status === params.status);
  }

  if (params.customer_type) {
    filtered = filtered.filter(
      (inv) => inv.customerType === params.customer_type
    );
  }

  if (params.type) {
    filtered = filtered.filter((inv) => inv.type === params.type);
  }

  const total = filtered.length;
  const start = params.start || 0;
  const length = params.length || 10;
  const data = filtered.slice(start, start + length);
  const totalPage = Math.ceil(total / length);
  const currentPage = Math.floor(start / length) + 1;

  return {
    data,
    metadata: {
      total_data: total,
      total_page: totalPage,
      current_page: currentPage,
      per_page: length,
    },
  };
}

export const getInvoicesQueryOptions = (params: InvoiceParams) => {
  return queryOptions({
    queryKey: INVOICE_KEYS.list(params as unknown as Record<string, unknown>),
    queryFn: () => getInvoices(params),
  });
};

export function useInvoices({ params }: { params: InvoiceParams }) {
  return useQuery(getInvoicesQueryOptions(params));
}
