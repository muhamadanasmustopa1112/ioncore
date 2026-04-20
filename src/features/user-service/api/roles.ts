import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  CreateRoleRequest,
  PaginationParams,
  Role,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listRoles = (params?: PaginationParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<Role[]>>(`${base}/roles`, {
    params,
  });

export const createRole = (payload: CreateRoleRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Role>>(
    `${base}/roles`,
    payload,
  );

export const useRoles = (params?: PaginationParams) =>
  useQuery({
    queryKey: userServiceKeys.roles(params),
    queryFn: () => listRoles(params),
  });

export const useCreateRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRoleRequest) => createRole(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userServiceKeys.all }),
  });
};
