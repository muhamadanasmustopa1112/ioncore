import { useQuery } from "@tanstack/react-query";
import { DUMMY_RESELLERS } from "../data/dummy-resellers";
import type { ResellerListData, ResellerListParams } from "../types/reseller";
import { RESELLER_KEYS } from "./keys";

function filterResellers(params: ResellerListParams): ResellerListData {
  let filtered = [...DUMMY_RESELLERS];

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.legal_name.toLowerCase().includes(search) ||
        r.contact_person.toLowerCase().includes(search) ||
        r.parent_sister_company_name.toLowerCase().includes(search)
    );
  }

  if (params.status) {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const start = (page - 1) * per_page;
  const paginated = filtered.slice(start, start + per_page);

  return {
    resellers: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useResellers(params: ResellerListParams = {}) {
  return useQuery<ResellerListData>({
    queryKey: RESELLER_KEYS.list(params),
    queryFn: () => filterResellers(params),
  });
}
