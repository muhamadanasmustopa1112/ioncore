import { queryOptions, useQuery } from "@tanstack/react-query";
import { AuthUser } from "@/types/auth";
import { BaseResponse } from "@/types/base";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { PROFILE_KEYS } from "./keys";

export const getUsers = (): Promise<BaseResponse<AuthUser>> =>
  // api.get(`${services.auth}/authentication/profile`);
  Promise.resolve({
    app_name: "ION Dashboard",
    version: "1.0.0",
    response: {
      code: "200",
      status: "success",
      message_en: "Success",
      data: {
        guid: "user-123",
        username: "Alex Thompson",
        roles: {
          guid: "role-admin",
          name: "Administrator",
        },
        employee_detail: {
          fullname: "Alex Thompson",
          email: "demo.account@gmail.com",
          job: {
            job_name: "Senior Administrator",
          },
        },
      },
    },
  });

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
