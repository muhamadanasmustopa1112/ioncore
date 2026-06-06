import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  ThresholdDashboardFilterParams,
  ThresholdDashboardListParams,
  ThresholdDashboardListResponse,
} from "../types/threshold-dashboard";

const BASE = `${services.warehouse}`;

export const getThresholdDashboard = async (
  params: ThresholdDashboardListParams
): Promise<ThresholdDashboardListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/reports/threshold-dashboard`, {
    params,
  });
};

export const getThresholdDashboardQueryOptions = (
  params: ThresholdDashboardListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.thresholdDashboard(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getThresholdDashboard(params),
  });
};

type UseThresholdDashboardOptions = {
  params: ThresholdDashboardListParams;
  queryConfig?: QueryConfig<typeof getThresholdDashboardQueryOptions>;
};

export const useThresholdDashboard = ({
  params,
  queryConfig,
}: UseThresholdDashboardOptions) => {
  return useQuery({
    ...getThresholdDashboardQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteThresholdDashboardOptions = ThresholdDashboardFilterParams & {
  limit: number;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteThresholdDashboard = ({
  limit,
  status,
  queryConfig,
}: UseInfiniteThresholdDashboardOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.thresholdDashboard({
      limit,
      status,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getThresholdDashboard({ page: pageParam, limit, status }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
