import { useQuery } from "@tanstack/react-query";
import { DUMMY_SETTLEMENTS } from "../data/dummy-settlements";
import type { SettlementListData, SettlementListParams } from "../types/settlement";
import { SETTLEMENT_KEYS } from "./keys";

function filterSettlements(params: SettlementListParams): SettlementListData {
  let filtered = [...DUMMY_SETTLEMENTS];

  if (params.reseller_name) {
    const search = params.reseller_name.toLowerCase();
    filtered = filtered.filter((s) => s.reseller_name.toLowerCase().includes(search));
  }

  if (params.period) {
    filtered = filtered.filter((s) => s.period_yyyy_mm === params.period);
  }

  if (params.payment_status) {
    filtered = filtered.filter((s) => s.payment_status === params.payment_status);
  }

  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const start = (page - 1) * per_page;
  const paginated = filtered.slice(start, start + per_page);

  return {
    settlements: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useSettlements(params: SettlementListParams = {}) {
  return useQuery<SettlementListData>({
    queryKey: SETTLEMENT_KEYS.list(params),
    queryFn: () => filterSettlements(params),
  });
}
