import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { StockLevelsListParams, StockLevelsListResponse } from "../types/stock-levels";

const BASE = `${services.warehouse}`;

export const getStockLevels = async (
  params: StockLevelsListParams
): Promise<StockLevelsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/frontend/stock-levels`, { params });
};

export const getStockLevelsQueryOptions = (params: StockLevelsListParams) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.stockLevels(params as unknown as Record<string, unknown>),
    queryFn: () => getStockLevels(params),
  });
};

type UseStockLevelsOptions = {
  params: StockLevelsListParams;
  queryConfig?: QueryConfig<typeof getStockLevelsQueryOptions>;
};

export const useStockLevels = ({
  params,
  queryConfig,
}: UseStockLevelsOptions) => {
  return useQuery({
    ...getStockLevelsQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteStockLevelsOptions = {
  limit: number;
  search?: string;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteStockLevels = ({
  limit,
  search,
  queryConfig,
}: UseInfiniteStockLevelsOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.stockLevels({ limit, search, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      getStockLevels({ page: pageParam, limit, search }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
