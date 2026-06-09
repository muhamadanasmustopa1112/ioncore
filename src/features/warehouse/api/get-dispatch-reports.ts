import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  DispatchReportsListParams,
  DispatchReportsListResponse,
} from "../types/dispatch-reports";

const BASE = `${services.warehouse}`;

export const getDispatchReports = async (
  params: DispatchReportsListParams
): Promise<DispatchReportsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/reports/dispatches`, { params });
};

export const getDispatchReportsQueryOptions = (
  params: DispatchReportsListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.dispatchReports(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getDispatchReports(params),
  });
};

type UseDispatchReportsOptions = {
  params: DispatchReportsListParams;
  queryConfig?: QueryConfig<typeof getDispatchReportsQueryOptions>;
};

export const useDispatchReports = ({
  params,
  queryConfig,
}: UseDispatchReportsOptions) => {
  return useQuery({
    ...getDispatchReportsQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteDispatchReportsOptions = {
  limit: number;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteDispatchReports = ({
  limit,
  queryConfig,
}: UseInfiniteDispatchReportsOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.dispatchReports({ limit, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      getDispatchReports({ page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
