import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { BandwidthItem } from "../types/bandwidth";
import { BANDWIDTH_KEYS } from "./keys";

export const getBandwidth = ({ code }: { code: string }): Promise<{ data: BandwidthItem }> => {
  return api.get(`${services.networking}/ion-radius/service-plans/bandwidth/${code}/`);
};

export const getBandwidthQueryOptions = (code: string) => {
  return queryOptions({
    queryKey: BANDWIDTH_KEYS.detail(code),
    queryFn: () => getBandwidth({ code }),
  });
};

type UseBandwidthOptions = {
  code: string;
  queryConfig?: QueryConfig<typeof getBandwidthQueryOptions>;
};

export const useBandwidth = ({ code, queryConfig }: UseBandwidthOptions) => {
  return useQuery({
    ...getBandwidthQueryOptions(code),
    ...queryConfig,
  });
};
