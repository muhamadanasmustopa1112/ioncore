import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  ReturnsListParams,
  ReturnsListResponse,
} from "../types/returns";

const BASE = `${services.warehouse}`;

export const getReturns = async (
  params: ReturnsListParams
): Promise<ReturnsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/returns`, { params });
};

export const getReturnsQueryOptions = (params: ReturnsListParams) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.returns(params as unknown as Record<string, unknown>),
    queryFn: () => getReturns(params),
  });
};

type UseReturnsOptions = {
  params: ReturnsListParams;
  queryConfig?: QueryConfig<typeof getReturnsQueryOptions>;
};

export const useReturns = ({ params, queryConfig }: UseReturnsOptions) => {
  return useQuery({
    ...getReturnsQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteReturnsOptions = {
  limit: number;
  warehouse_id?: number;
  disposition?: string;
  asset_id?: number;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteReturns = ({
  limit,
  warehouse_id,
  disposition,
  asset_id,
  queryConfig,
}: UseInfiniteReturnsOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.returns({
      limit,
      warehouse_id,
      disposition,
      asset_id,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getReturns({
        page: pageParam,
        limit,
        warehouse_id,
        disposition,
        asset_id,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
