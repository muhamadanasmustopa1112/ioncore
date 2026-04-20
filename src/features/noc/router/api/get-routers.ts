import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { RouterParams, RouterResponse } from "../types";

import { ROUTER_KEYS } from "./keys";

export const getRouters = (params: RouterParams): Promise<RouterResponse> => {
  return api.get(`${services.networking}/ion-radius/routers/`, {
    params,
  });
};

export const getRoutersQueryOptions = (params: RouterParams) => {
  return queryOptions({
    queryKey: ROUTER_KEYS.list(params),
    queryFn: () => getRouters(params),
  });
};

type UseRoutersOptions = {
  params: RouterParams;
  queryConfig?: QueryConfig<typeof getRoutersQueryOptions>;
};

export const useRouters = ({ params, queryConfig }: UseRoutersOptions) => {
  return useQuery({
    ...getRoutersQueryOptions(params),
    ...queryConfig,
  });
};
