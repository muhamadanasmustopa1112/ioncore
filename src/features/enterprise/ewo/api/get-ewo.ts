import { useQuery } from "@tanstack/react-query";
import { DUMMY_EWOS } from "../data/dummy-ewos";
import type { Ewo } from "../types/ewo";
import { EWO_KEYS } from "./keys";

export function useEwo(id: string | null) {
  return useQuery<Ewo | null>({
    queryKey: EWO_KEYS.detail(id!),
    queryFn: () => DUMMY_EWOS.find((e) => e.id === id) ?? null,
    enabled: !!id,
  });
}
