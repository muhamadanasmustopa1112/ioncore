import {
  queryOptions,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  StockItemsListParams,
  StockItemsListResponse,
} from "../types/stock-item";

const BASE = `${services.warehouse}`;

export const getStockItems = async (
  params?: StockItemsListParams
): Promise<StockItemsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/items`, { params });
};

export const getStockItemsQueryOptions = (params?: StockItemsListParams) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.stockItems(
      params as unknown as Record<string, unknown> | undefined
    ),
    queryFn: () => getStockItems(params),
  });
};

type UseStockItemsOptions = {
  params?: StockItemsListParams;
  queryConfig?: QueryConfig<typeof getStockItemsQueryOptions>;
};

export const useStockItems = ({
  params,
  queryConfig,
}: UseStockItemsOptions = {}) => {
  return useQuery({
    ...getStockItemsQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteStockItemsOptions = {
  limit: number;
  search?: string;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteStockItems = ({
  limit,
  search,
  queryConfig,
}: UseInfiniteStockItemsOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.stockItems({ limit, search, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      getStockItems({ page: pageParam, limit, search }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
