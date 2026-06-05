import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { HandoversListParams, HandoversListResponse } from "../types/handovers";

const BASE = `${services.warehouse}`;

export const getHandovers = async (
  params: HandoversListParams
): Promise<HandoversListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/handovers`, { params });
};

export const getHandoversQueryOptions = (
  params: HandoversListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.handovers(params as unknown as Record<string, unknown>),
    queryFn: () => getHandovers(params),
  });
};

type UseHandoversOptions = {
  params: HandoversListParams;
  queryConfig?: QueryConfig<typeof getHandoversQueryOptions>;
};

export const useHandovers = ({
  params,
  queryConfig,
}: UseHandoversOptions) => {
  return useQuery({
    ...getHandoversQueryOptions(params),
    ...queryConfig,
  });
};
