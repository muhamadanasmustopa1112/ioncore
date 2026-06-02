import { useQuery } from "@tanstack/react-query";
import { DUMMY_QUOTATIONS } from "../data/dummy-cpq";
import type { QuotationListData, QuotationListParams } from "../types/cpq";
import { CPQ_KEYS } from "./keys";

function filterQuotations(params: QuotationListParams): QuotationListData {
  let filtered = [...DUMMY_QUOTATIONS];

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
    quotations: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useQuotations(params: QuotationListParams = {}) {
  return useQuery<QuotationListData>({
    queryKey: CPQ_KEYS.quotations(params),
    queryFn: () => filterQuotations(params),
  });
}
