import { useQuery } from "@tanstack/react-query";
import { DUMMY_BOQS } from "../data/dummy-cpq";
import type { BoqListData, BoqListParams } from "../types/cpq";
import { CPQ_KEYS } from "./keys";

function filterBoqs(params: BoqListParams): BoqListData {
  let filtered = [...DUMMY_BOQS];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (v) => v.customer_name.toLowerCase().includes(search)
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
    boqs: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useBoqs(params: BoqListParams = {}) {
  return useQuery<BoqListData>({
    queryKey: CPQ_KEYS.boqs(params),
    queryFn: () => filterBoqs(params),
  });
}
