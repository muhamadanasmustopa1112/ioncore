import { queryOptions, useQuery } from "@tanstack/react-query";
import { AuthUser } from "@/types/auth";
import { BaseResponse } from "@/types/base";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { PROFILE_KEYS } from "./keys";

export const getUsers = (): Promise<BaseResponse<AuthUser>> =>
  api.get(`${services.auth}/authentication/profile`);

export const getUsersQueryOptions = () =>
  queryOptions({
    queryKey: PROFILE_KEYS.list({}),
    queryFn: () => getUsers(),
    retry: 1,
  });
type UseUsersOptions = {
  queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useUsers = ({ queryConfig }: UseUsersOptions = {}) =>
  useQuery({
    ...getUsersQueryOptions(),
    ...queryConfig,
  });
