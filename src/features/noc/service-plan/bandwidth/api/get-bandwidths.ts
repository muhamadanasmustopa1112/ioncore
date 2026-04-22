import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { BandwidthParams, BandwidthResponse } from "../types";
import { BANDWIDTH_KEYS } from "./keys";

export const getBandwidths = (
  params: BandwidthParams,
): Promise<BandwidthResponse> => {
  return api.get(`${services.networking}/ion-radius/service-plans/bandwidth/`, {
    params,
  });
};

export const getBandwidthsQueryOptions = (params: BandwidthParams) => {
  return queryOptions({
    queryKey: BANDWIDTH_KEYS.list(params),
    queryFn: () => getBandwidths(params),
  });
};

type UseBandwidthsOptions = {
  params: BandwidthParams;
  queryConfig?: QueryConfig<typeof getBandwidthsQueryOptions>;
};

export const useBandwidths = ({
  params,
  queryConfig,
}: UseBandwidthsOptions) => {
  return useQuery({
    ...getBandwidthsQueryOptions(params),
    ...queryConfig,
  });
};
