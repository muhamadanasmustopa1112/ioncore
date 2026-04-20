import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { userServiceApi } from "./client";
import { userServiceKeys } from "./keys";
import type {
  Branch,
  CreateBranchRequest,
  PaginationParams,
  UserServiceEnvelope,
} from "../types";

const base = services.user;

export const listBranches = (params?: PaginationParams) =>
  userServiceApi.get<unknown, UserServiceEnvelope<Branch[]>>(
    `${base}/branches`,
    { params },
  );

export const createBranch = (payload: CreateBranchRequest) =>
  userServiceApi.post<unknown, UserServiceEnvelope<Branch>>(
    `${base}/branches`,
    payload,
  );

export const useBranches = (params?: PaginationParams) =>
  useQuery({
    queryKey: userServiceKeys.branches(params),
    queryFn: () => listBranches(params),
  });

export const useCreateBranch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBranchRequest) => createBranch(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: userServiceKeys.branches() }),
  });
};
