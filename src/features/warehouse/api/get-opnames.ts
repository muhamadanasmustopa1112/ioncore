import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  OpnamesListParams,
  OpnamesListResponse,
} from "../types/opnames";

const BASE = `${services.warehouse}`;

export const getOpnames = async (
  params: OpnamesListParams
): Promise<OpnamesListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/opnames`, { params });
};

export const getOpnamesQueryOptions = (params: OpnamesListParams) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.opnames(params as unknown as Record<string, unknown>),
    queryFn: () => getOpnames(params),
  });
};

type UseOpnamesOptions = {
  params: OpnamesListParams;
  queryConfig?: QueryConfig<typeof getOpnamesQueryOptions>;
};

export const useOpnames = ({ params, queryConfig }: UseOpnamesOptions) => {
  return useQuery({
    ...getOpnamesQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteOpnamesOptions = {
  limit: number;
  search?: string;
  warehouse_id?: number;
  status?: string;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteOpnames = ({
  limit,
  search,
  warehouse_id,
  status,
  queryConfig,
}: UseInfiniteOpnamesOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.opnames({
      limit,
      search,
      warehouse_id,
      status,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getOpnames({
        page: pageParam,
        limit,
        search,
        warehouse_id,
        status,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
