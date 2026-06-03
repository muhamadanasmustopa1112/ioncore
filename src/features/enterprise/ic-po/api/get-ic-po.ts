import { useQuery } from "@tanstack/react-query";
import { DUMMY_IC_POS } from "../data/dummy-ic-po";
import type { IntercompanyPo } from "../types/ic-po";
import { IC_PO_KEYS } from "./keys";

export function useIcPo(id: string | null) {
  return useQuery<IntercompanyPo | null>({
    queryKey: IC_PO_KEYS.detail(id!),
    queryFn: () => DUMMY_IC_POS.find((po) => po.id === id) ?? null,
    enabled: !!id,
  });
}
