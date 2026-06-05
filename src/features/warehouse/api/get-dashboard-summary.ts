import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { DashboardSummaryResponse } from "../types";

const BASE = `${services.warehouse}`;

export const getDashboardSummary = async (): Promise<DashboardSummaryResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/frontend/dashboard-summary`);
};

export const getDashboardSummaryQueryOptions = () => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.dashboard(),
    queryFn: () => getDashboardSummary(),
  });
};

type UseDashboardSummaryOptions = {
  queryConfig?: QueryConfig<typeof getDashboardSummaryQueryOptions>;
};

export const useDashboardSummary = ({
  queryConfig,
}: UseDashboardSummaryOptions = {}) => {
  return useQuery({
    ...getDashboardSummaryQueryOptions(),
    ...queryConfig,
  });
};
