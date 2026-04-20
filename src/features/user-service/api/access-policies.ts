import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  AccessPolicy,
  CreateAccessPolicyRequest,
  PaginationParams,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listAccessPolicies = (params?: PaginationParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<AccessPolicy[]>>(
    `${base}/access-policies`,
    { params },
  );

export const createAccessPolicy = (payload: CreateAccessPolicyRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<AccessPolicy>>(
    `${base}/access-policies`,
    payload,
  );

export const useAccessPolicies = (params?: PaginationParams) =>
  useQuery({
    queryKey: userServiceKeys.accessPolicies(params),
    queryFn: () => listAccessPolicies(params),
  });

export const useCreateAccessPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAccessPolicyRequest) =>
      createAccessPolicy(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userServiceKeys.all }),
  });
};
