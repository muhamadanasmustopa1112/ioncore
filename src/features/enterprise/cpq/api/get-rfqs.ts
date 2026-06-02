import { useQuery } from "@tanstack/react-query";
import { DUMMY_RFQS } from "../data/dummy-cpq";
import type { RfqListData, RfqListParams } from "../types/cpq";
import { CPQ_KEYS } from "./keys";

function filterRfqs(params: RfqListParams): RfqListData {
  let filtered = [...DUMMY_RFQS];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.customer_name.toLowerCase().includes(search) ||
        v.item_description.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((v) => v.status === params.status);
  }

  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const start = (page - 1) * per_page;
  const paginated = filtered.slice(start, start + per_page);

  return {
    rfqs: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useRfqs(params: RfqListParams = {}) {
  return useQuery<RfqListData>({
    queryKey: CPQ_KEYS.rfqs(params),
    queryFn: () => filterRfqs(params),
  });
}
