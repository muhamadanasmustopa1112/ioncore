import { useQuery } from "@tanstack/react-query";
import { DUMMY_SETTLEMENTS } from "../data/dummy-settlements";
import type { Settlement } from "../types/settlement";
import { SETTLEMENT_KEYS } from "./keys";

export function useSettlement(id: string | null) {
  return useQuery<Settlement | null>({
    queryKey: SETTLEMENT_KEYS.detail(id!),
    queryFn: () => DUMMY_SETTLEMENTS.find((s) => s.id === id) ?? null,
    enabled: !!id,
  });
}
