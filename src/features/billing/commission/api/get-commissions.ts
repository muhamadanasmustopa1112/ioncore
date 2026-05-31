import { useQuery, queryOptions } from "@tanstack/react-query";
import { COMMISSION_KEYS } from "./keys";
import { dummyCommissions } from "../data/dummy-commissions";
import type { CommissionListResponse, CommissionParams } from "../types";

async function getCommissions(
  params: CommissionParams
): Promise<CommissionListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...dummyCommissions];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.commissionNumber.toLowerCase().includes(search) ||
        c.salesRepName.toLowerCase().includes(search) ||
        c.customerName.toLowerCase().includes(search) ||
        c.invoiceNumber.toLowerCase().includes(search) ||
        c.branch.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((c) => c.status === params.status);
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

export const getCommissionsQueryOptions = (params: CommissionParams) => {
  return queryOptions({
    queryKey: COMMISSION_KEYS.list(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getCommissions(params),
  });
};

export function useCommissions({ params }: { params: CommissionParams }) {
  return useQuery(getCommissionsQueryOptions(params));
}
