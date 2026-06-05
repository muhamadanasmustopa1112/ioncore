import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { StockItemsListResponse } from "../types/stock-item";

const BASE = `${services.warehouse}`;

export const getStockItems = async (): Promise<StockItemsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/items`);
};

export const getStockItemsQueryOptions = () => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.stockItems(),
    queryFn: () => getStockItems(),
  });
};

type UseStockItemsOptions = {
  queryConfig?: QueryConfig<typeof getStockItemsQueryOptions>;
};

export const useStockItems = ({
  queryConfig,
}: UseStockItemsOptions = {}) => {
  return useQuery({
    ...getStockItemsQueryOptions(),
    ...queryConfig,
  });
};
