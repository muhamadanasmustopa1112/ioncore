import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  OpnameDiscrepanciesFilterParams,
  OpnameDiscrepanciesListParams,
  OpnameDiscrepanciesListResponse,
} from "../types/opname-discrepancies";

const BASE = `${services.warehouse}`;

export const getOpnameDiscrepancies = async (
  params: OpnameDiscrepanciesListParams
): Promise<OpnameDiscrepanciesListResponse> => {
  return userServiceApi.get(
    `${BASE}/warehouse/reports/opname-discrepancies`,
    { params }
  );
};

export const getOpnameDiscrepanciesQueryOptions = (
  params: OpnameDiscrepanciesListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.opnameDiscrepancies(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getOpnameDiscrepancies(params),
  });
};

type UseOpnameDiscrepanciesOptions = {
  params: OpnameDiscrepanciesListParams;
  queryConfig?: QueryConfig<typeof getOpnameDiscrepanciesQueryOptions>;
};

export const useOpnameDiscrepancies = ({
  params,
  queryConfig,
}: UseOpnameDiscrepanciesOptions) => {
  return useQuery({
    ...getOpnameDiscrepanciesQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteOpnameDiscrepanciesOptions =
  OpnameDiscrepanciesFilterParams & {
    limit: number;
    queryConfig?: { enabled?: boolean };
  };

export const useInfiniteOpnameDiscrepancies = ({
  limit,
  warehouse_id,
  status,
  queryConfig,
}: UseInfiniteOpnameDiscrepanciesOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.opnameDiscrepancies({
      limit,
      warehouse_id,
      status,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getOpnameDiscrepancies({
        page: pageParam,
        limit,
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
