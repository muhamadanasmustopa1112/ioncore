import { useQuery, queryOptions } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { RouterItem } from "../types";
import { ROUTER_KEYS } from "./keys";

export const getRouter = (id: string): Promise<{ data: RouterItem }> => {
  return api.get(`${services.networking}/ion-radius/routers/${id}`);
};

export const getRouterQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ROUTER_KEYS.detail(id),
    queryFn: () => getRouter(id),
  });
};

type UseRouterOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getRouterQueryOptions>;
};

export const useGetRouter = ({ id, queryConfig }: UseRouterOptions) => {
  return useQuery({
    ...getRouterQueryOptions(id),
    ...queryConfig,
    enabled: !!id,
  });
};
