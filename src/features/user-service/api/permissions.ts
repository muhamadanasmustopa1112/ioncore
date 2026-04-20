import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  CreatePermissionRequest,
  PaginationParams,
  Permission,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listPermissions = (params?: PaginationParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<Permission[]>>(
    `${base}/permissions`,
    { params },
  );

export const createPermission = (payload: CreatePermissionRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Permission>>(
    `${base}/permissions`,
    payload,
  );

export const usePermissions = (params?: PaginationParams) =>
  useQuery({
    queryKey: userServiceKeys.permissions(params),
    queryFn: () => listPermissions(params),
  });

export const useCreatePermission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePermissionRequest) => createPermission(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userServiceKeys.all }),
  });
};
