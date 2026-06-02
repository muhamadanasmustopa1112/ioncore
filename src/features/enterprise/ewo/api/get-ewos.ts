import { useQuery } from "@tanstack/react-query";
import { DUMMY_EWOS } from "../data/dummy-ewos";
import type { EwoListData, EwoListParams } from "../types/ewo";
import { EWO_KEYS } from "./keys";

function filterEwos(params: EwoListParams): EwoListData {
  let filtered = [...DUMMY_EWOS];

  if (params.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.ewo_number.toLowerCase().includes(s) ||
        e.project_name.toLowerCase().includes(s) ||
        e.executing_company_name.toLowerCase().includes(s) ||
        e.assigned_technician_name.toLowerCase().includes(s) ||
        e.site_name.toLowerCase().includes(s)
    );
  }

  if (params.status) {
    filtered = filtered.filter((e) => e.status === params.status);
  }

  if (params.ewo_type) {
    filtered = filtered.filter((e) => e.ewo_type === params.ewo_type);
  }

  if (params.priority) {
    filtered = filtered.filter((e) => e.priority === params.priority);
  }

  const page = params.page || 1;
  const per_page = params.per_page || 10;
  const start = (page - 1) * per_page;
  const paginated = filtered.slice(start, start + per_page);

  return {
    ewos: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useEwos(params: EwoListParams = {}) {
  return useQuery<EwoListData>({
    queryKey: EWO_KEYS.list(params),
    queryFn: () => filterEwos(params),
  });
}
