import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { ProfileGroupParams, ProfileGroupResponse } from "../types";

import { PROFILE_GROUP_KEYS } from "./keys";

export const getProfileGroups = (
  params: ProfileGroupParams,
): Promise<ProfileGroupResponse> => {
  return api.get(
    `${services.networking}/ion-radius/service-plans/profile-groups/`,
    {
      params,
    },
  );
};

export const getProfileGroupsQueryOptions = (params: ProfileGroupParams) => {
  return queryOptions({
    queryKey: PROFILE_GROUP_KEYS.list(params),
    queryFn: () => getProfileGroups(params),
  });
};

type UseProfileGroupsOptions = {
  params: ProfileGroupParams;
  queryConfig?: QueryConfig<typeof getProfileGroupsQueryOptions>;
};

export const useProfileGroups = ({
  params,
  queryConfig,
}: UseProfileGroupsOptions) => {
  return useQuery({
    ...getProfileGroupsQueryOptions(params),
    ...queryConfig,
  });
};
