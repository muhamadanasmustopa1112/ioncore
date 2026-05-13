import { useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { QueryConfig } from "@/lib/react-query";

import type { ResponseEnvelope, DispatchMapParams, DispatchMapResponse } from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

const BASE = services.technical;

// --- API Functions ---
export const getRepeatIssues = (
  params: { branch_id?: string; period_days?: number } = {},
): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.get(`${BASE}/analytics/repeat-issues`, {
    params,
  }) as unknown as Promise<ResponseEnvelope<any>>;
};

export const getDispatchMap = (
  params: DispatchMapParams = {},
): Promise<ResponseEnvelope<DispatchMapResponse>> => {
  return userServiceApi.get(`${BASE}/dispatch/map`, {
    params,
  }) as unknown as Promise<ResponseEnvelope<DispatchMapResponse>>;
};

export const getTechnicianPerformance = (
  params: { branch_id?: string; period_days?: number } = {},
): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.get(`${BASE}/technicians/performance`, {
    params,
  }) as unknown as Promise<ResponseEnvelope<any>>;
};

export const getTechnicianWorkOrderHistory = (
  technicianId: string,
  params: { branch_id?: string; period_days?: number } = {},
): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.get(
    `${BASE}/technicians/${technicianId}/work-order-history`,
    { params },
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const getCustomerWorkOrderHistory = (
  customerId: string,
): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.get(
    `${BASE}/customers/${customerId}/work-order-history`,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const getSiteWorkOrderHistory = (
  siteId: string,
): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.get(
    `${BASE}/sites/${siteId}/work-order-history`,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

// --- Hooks ---
type UseRepeatIssuesOptions = {
  params?: { branch_id?: string; period_days?: number };
  queryConfig?: QueryConfig<typeof getRepeatIssues>;
};

export const useRepeatIssues = ({
  params = {},
  queryConfig,
}: UseRepeatIssuesOptions = {}) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.repeatIssues(params),
    queryFn: async () => (await getRepeatIssues(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseDispatchMapOptions = {
  params?: DispatchMapParams;
  queryConfig?: any;
};

export const useDispatchMap = ({
  params = {},
  queryConfig,
}: UseDispatchMapOptions = {}) => {
  return useQuery<DispatchMapResponse>({
    queryKey: TECHNICIAN_KEYS.dispatchMap(params),
    queryFn: async () => (await getDispatchMap(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseTechnicianPerformanceOptions = {
  params?: { branch_id?: string; period_days?: number };
  queryConfig?: QueryConfig<typeof getTechnicianPerformance>;
};

export const useTechnicianPerformance = ({
  params = {},
  queryConfig,
}: UseTechnicianPerformanceOptions = {}) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.technicianPerformance(params),
    queryFn: async () => (await getTechnicianPerformance(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseTechnicianHistoryOptions = {
  technicianId: string;
  params?: { branch_id?: string; period_days?: number };
  queryConfig?: QueryConfig<typeof getTechnicianWorkOrderHistory>;
};

export const useTechnicianHistory = ({
  technicianId,
  params = {},
  queryConfig,
}: UseTechnicianHistoryOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.technicianHistory(technicianId, params),
    queryFn: async () =>
      (await getTechnicianWorkOrderHistory(technicianId, params)).data,
    enabled: !!technicianId,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseCustomerHistoryOptions = {
  customerId: string;
  queryConfig?: QueryConfig<typeof getCustomerWorkOrderHistory>;
};

export const useCustomerHistory = ({
  customerId,
  queryConfig,
}: UseCustomerHistoryOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.customerHistory(customerId),
    queryFn: async () => (await getCustomerWorkOrderHistory(customerId)).data,
    enabled: !!customerId,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseSiteHistoryOptions = {
  siteId: string;
  queryConfig?: QueryConfig<typeof getSiteWorkOrderHistory>;
};

export const useSiteHistory = ({
  siteId,
  queryConfig,
}: UseSiteHistoryOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.siteHistory(siteId),
    queryFn: async () => (await getSiteWorkOrderHistory(siteId)).data,
    enabled: !!siteId,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};
