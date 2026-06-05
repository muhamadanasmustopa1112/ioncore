import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  TransfersListParams,
  TransfersListResponse,
  TransferDetailResponse,
} from "../types/transfers";

const BASE = `${services.warehouse}`;

export const getTransfers = async (
  params: TransfersListParams
): Promise<TransfersListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/frontend/transfers`, { params });
};

export const getTransfersQueryOptions = (params: TransfersListParams) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.transfers(params as unknown as Record<string, unknown>),
    queryFn: () => getTransfers(params),
  });
};

type UseTransfersOptions = {
  params: TransfersListParams;
  queryConfig?: QueryConfig<typeof getTransfersQueryOptions>;
};

export const useTransfers = ({
  params,
  queryConfig,
}: UseTransfersOptions) => {
  return useQuery({
    ...getTransfersQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteTransfersOptions = {
  limit: number;
  search?: string;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteTransfers = ({
  limit,
  search,
  queryConfig,
}: UseInfiniteTransfersOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.transfers({ limit, search, infinite: true }),
    queryFn: ({ pageParam = 1 }) =>
      getTransfers({ page: pageParam, limit, search }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};

export const getTransferDetail = async (
  id: string
): Promise<TransferDetailResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/frontend/transfers/${id}`);
};

export const getTransferDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.transferDetail(id),
    queryFn: () => getTransferDetail(id),
  });
};

type UseTransferDetailOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getTransferDetailQueryOptions>;
};

export const useTransferDetail = ({
  id,
  queryConfig,
}: UseTransferDetailOptions) => {
  return useQuery({
    ...getTransferDetailQueryOptions(id),
    ...queryConfig,
  });
};
