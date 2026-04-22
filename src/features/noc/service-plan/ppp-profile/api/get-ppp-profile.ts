import { useQuery, queryOptions } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { PPPProfileItem } from "../types";
import { PPP_PROFILE_KEYS } from "./keys";

export const getPPPProfile = (id: string): Promise<{ data: PPPProfileItem }> => {
  return api.get(`${services.networking}/ion-radius/service-plans/ppp-profiles/${id}`);
};

export const getPPPProfileQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: PPP_PROFILE_KEYS.detail(id),
    queryFn: () => getPPPProfile(id),
  });
};

type UsePPPProfileOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getPPPProfileQueryOptions>;
};

export const useGetPPPProfile = ({ id, queryConfig }: UsePPPProfileOptions) => {
  return useQuery({
    ...getPPPProfileQueryOptions(id),
    ...queryConfig,
    enabled: !!id,
  });
};
