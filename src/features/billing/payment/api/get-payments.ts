import { useQuery, queryOptions } from "@tanstack/react-query";
import { PAYMENT_KEYS } from "./keys";
import { dummyPayments } from "../data/dummy-payments";
import type { PaymentListResponse, PaymentParams } from "../types";

async function getPayments(params: PaymentParams): Promise<PaymentListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...dummyPayments];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (pay) =>
        pay.paymentNumber.toLowerCase().includes(search) ||
        pay.invoiceNumber.toLowerCase().includes(search) ||
        pay.customerName.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((pay) => pay.status === params.status);
  }

  if (params.method) {
    filtered = filtered.filter((pay) => pay.method === params.method);
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

export const getPaymentsQueryOptions = (params: PaymentParams) => {
  return queryOptions({
    queryKey: PAYMENT_KEYS.list(params as unknown as Record<string, unknown>),
    queryFn: () => getPayments(params),
  });
};

export function usePayments({ params }: { params: PaymentParams }) {
  return useQuery(getPaymentsQueryOptions(params));
}
