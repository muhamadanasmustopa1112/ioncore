import { useQuery } from "@tanstack/react-query";
import { DUMMY_IC_POS } from "../data/dummy-ic-po";
import type { IcPoListData, IcPoListParams } from "../types/ic-po";
import { IC_PO_KEYS } from "./keys";

function filterIcPos(params: IcPoListParams): IcPoListData {
  let filtered = [...DUMMY_IC_POS];

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (po) =>
        po.id.toLowerCase().includes(s) ||
        po.issuer_company_name.toLowerCase().includes(s) ||
        po.receiver_company_name.toLowerCase().includes(s)
    );
  }

  if (params.status) {
    filtered = filtered.filter((po) => po.status === params.status);
  }

  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const start = (page - 1) * per_page;
  const paginated = filtered.slice(start, start + per_page);

  return {
    items: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useIcPos(params: IcPoListParams = {}) {
  return useQuery<IcPoListData>({
    queryKey: IC_PO_KEYS.list(params),
    queryFn: () => filterIcPos(params),
  });
}
