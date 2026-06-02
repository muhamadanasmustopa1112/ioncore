import { useQuery } from "@tanstack/react-query";
import { DUMMY_VENDORS } from "../data/dummy-vendors";
import type { VendorListData, VendorListParams } from "../types/vendor";
import { VENDOR_KEYS } from "./keys";

function filterVendors(params: VendorListParams): VendorListData {
  let filtered = [...DUMMY_VENDORS];

  if (params.name) {
    const search = params.name.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.company_name.toLowerCase().includes(search) ||
        v.contact_person.toLowerCase().includes(search)
    );
  }

  if (params.category) {
    filtered = filtered.filter((v) =>
      v.service_categories.includes(params.category!)
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
    vendors: paginated,
    metadata: {
      page,
      per_page,
      total: filtered.length,
      total_page: Math.ceil(filtered.length / per_page),
    },
  };
}

export function useVendors(params: VendorListParams = {}) {
  return useQuery<VendorListData>({
    queryKey: VENDOR_KEYS.list(params),
    queryFn: () => filterVendors(params),
  });
}
