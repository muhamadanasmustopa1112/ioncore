import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { CreateStockItemPayload, StockItemResponse } from "../types/stock-item";

const BASE = `${services.warehouse}`;

export const createStockItem = async (
  payload: CreateStockItemPayload
): Promise<StockItemResponse> => {
  return userServiceApi.post(`${BASE}/warehouse/items`, payload);
};

type UseCreateStockItemOptions = {
  mutationConfig?: MutationConfig<typeof createStockItem>;
};

export const useCreateStockItem = ({
  mutationConfig,
}: UseCreateStockItemOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStockItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
    },
    ...mutationConfig,
  });
};
