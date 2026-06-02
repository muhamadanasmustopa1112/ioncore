import { useQuery } from "@tanstack/react-query";
import { DUMMY_RESELLERS } from "../data/dummy-resellers";
import type { Reseller } from "../types/reseller";
import { RESELLER_KEYS } from "./keys";

export function useReseller(id: string | null) {
  return useQuery<Reseller | null>({
    queryKey: RESELLER_KEYS.detail(id!),
    queryFn: () => DUMMY_RESELLERS.find((r) => r.id === id) ?? null,
    enabled: !!id,
  });
}
