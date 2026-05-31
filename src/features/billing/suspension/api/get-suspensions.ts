import { useQuery, queryOptions } from "@tanstack/react-query";
import { SUSPENSION_KEYS } from "./keys";
import { dummySuspensions } from "../data/dummy-suspensions";
import type { SuspensionListResponse, SuspensionParams } from "../types";

async function getSuspensions(
  params: SuspensionParams
): Promise<SuspensionListResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filtered = [...dummySuspensions];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.customerName.toLowerCase().includes(search) ||
        s.invoiceNumber.toLowerCase().includes(search) ||
        s.branch.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((s) => s.status === params.status);
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

export const getSuspensionsQueryOptions = (params: SuspensionParams) => {
  return queryOptions({
    queryKey: SUSPENSION_KEYS.list(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getSuspensions(params),
  });
};

export function useSuspensions({ params }: { params: SuspensionParams }) {
  return useQuery(getSuspensionsQueryOptions(params));
}
