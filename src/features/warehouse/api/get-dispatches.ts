import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { DispatchesListParams, DispatchesListResponse } from "../types/dispatches";

const BASE = `${services.warehouse}`;

export const getDispatches = async (
  params: DispatchesListParams
): Promise<DispatchesListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/dispatches`, { params });
};

export const getDispatchesQueryOptions = (params: DispatchesListParams) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.dispatches(params as unknown as Record<string, unknown>),
    queryFn: () => getDispatches(params),
  });
};

type UseDispatchesOptions = {
  params: DispatchesListParams;
  queryConfig?: QueryConfig<typeof getDispatchesQueryOptions>;
};

export const useDispatches = ({
  params,
  queryConfig,
}: UseDispatchesOptions) => {
  return useQuery({
    ...getDispatchesQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteDispatchesOptions = {
  limit: number;
  wo_id?: string;
  technician_user_id?: string;
  source_warehouse_id?: number;
  status?: string;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteDispatches = ({
  limit,
  wo_id,
  technician_user_id,
  source_warehouse_id,
  status,
  queryConfig,
}: UseInfiniteDispatchesOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.dispatches({
      limit,
      wo_id,
      technician_user_id,
      source_warehouse_id,
      status,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getDispatches({
        page: pageParam,
        limit,
        wo_id,
        technician_user_id,
        source_warehouse_id,
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
