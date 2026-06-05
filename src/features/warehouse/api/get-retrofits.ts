import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { RetrofitsListParams, RetrofitsListResponse } from "../types/retrofits";

const BASE = `${services.warehouse}`;

export const getRetrofits = async (
  params: RetrofitsListParams
): Promise<RetrofitsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/frontend/retrofits`, { params });
};

export const getRetrofitsQueryOptions = (
  params: RetrofitsListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.retrofits(params as unknown as Record<string, unknown>),
    queryFn: () => getRetrofits(params),
  });
};

type UseRetrofitsOptions = {
  params: RetrofitsListParams;
  queryConfig?: QueryConfig<typeof getRetrofitsQueryOptions>;
};

export const useRetrofits = ({
  params,
  queryConfig,
}: UseRetrofitsOptions) => {
  return useQuery({
    ...getRetrofitsQueryOptions(params),
    ...queryConfig,
  });
};
