import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { PPPProfileParams, PPPProfileResponse } from "../types";

import { PPP_PROFILE_KEYS } from "./keys";

export const getPPPProfiles = (
  params: PPPProfileParams,
): Promise<PPPProfileResponse> => {
  return api.get(
    `${services.networking}/ion-radius/service-plans/ppp-profiles/`,
    {
      params,
    },
  );
};

export const getPPPProfilesQueryOptions = (params: PPPProfileParams) => {
  return queryOptions({
    queryKey: PPP_PROFILE_KEYS.list(params),
    queryFn: () => getPPPProfiles(params),
  });
};

type UsePPPProfilesOptions = {
  params: PPPProfileParams;
  queryConfig?: QueryConfig<typeof getPPPProfilesQueryOptions>;
};

export const usePPPProfiles = ({
  params,
  queryConfig,
}: UsePPPProfilesOptions) => {
  return useQuery({
    ...getPPPProfilesQueryOptions(params),
    ...queryConfig,
  });
};
