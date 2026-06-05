import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { SerializedAssetsListParams, SerializedAssetsListResponse } from "../types/serialized-assets";

const BASE = `${services.warehouse}`;

export const getSerializedAssets = async (
  params: SerializedAssetsListParams
): Promise<SerializedAssetsListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/frontend/serialized-assets`, { params });
};

export const getSerializedAssetsQueryOptions = (
  params: SerializedAssetsListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.serializedAssets(params as unknown as Record<string, unknown>),
    queryFn: () => getSerializedAssets(params),
  });
};

type UseSerializedAssetsOptions = {
  params: SerializedAssetsListParams;
  queryConfig?: QueryConfig<typeof getSerializedAssetsQueryOptions>;
};

export const useSerializedAssets = ({
  params,
  queryConfig,
}: UseSerializedAssetsOptions) => {
  return useQuery({
    ...getSerializedAssetsQueryOptions(params),
    ...queryConfig,
  });
};
