import { useQuery } from "@tanstack/react-query";
import { DUMMY_PRE_BOQS } from "../data/dummy-cpq";
import type { PreBoqListData, PreBoqListParams } from "../types/cpq";
import { CPQ_KEYS } from "./keys";

function filterPreBoqs(params: PreBoqListParams): PreBoqListData {
  let filtered = [...DUMMY_PRE_BOQS];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.customer_name.toLowerCase().includes(search) ||
        v.service_requirements.toLowerCase().includes(search) ||
        v.assigned_sales_rep.toLowerCase().includes(search)
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
    pre_boqs: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function usePreBoqs(params: PreBoqListParams = {}) {
  return useQuery<PreBoqListData>({
    queryKey: CPQ_KEYS.preBoqs(params),
    queryFn: () => filterPreBoqs(params),
  });
}
