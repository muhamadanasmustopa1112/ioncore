import { useQuery } from "@tanstack/react-query";
import { DUMMY_VENDORS } from "../data/dummy-vendors";
import type { Vendor } from "../types/vendor";
import { VENDOR_KEYS } from "./keys";

export function useVendor(id: string | null) {
  return useQuery<Vendor | null>({
    queryKey: VENDOR_KEYS.detail(id!),
    queryFn: () => DUMMY_VENDORS.find((v) => v.id === id) ?? null,
    enabled: !!id,
  });
}
