import { useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { QueryConfig } from "@/lib/react-query";

import type {
  ListTechniciansParams,
  Metadata,
  WorkOrderDashboardEnvelope,
  WorkOrderDashboardItem,
  WorkOrderDashboardSummary,
  WorkOrderDetailEnvelope,
  WorkOrderListParams,
  WorkOrderTimelineEnvelope,
  TechnicianLatestLocation,
  TechnicianLatestLocationsResponse,
} from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

interface ResponseEnvelope<T> {
  message: string;
  data: T;
  error: string;
  metadata: any;
}

const BASE = services.technical;

// --- API Functions ---
export const getWorkOrders = (
  params: WorkOrderListParams = {},
): Promise<WorkOrderDashboardEnvelope> => {
  return userServiceApi.get(`${BASE}/work-orders`, {
    params: {
      page: params.page ?? 1,
      per_page: params.per_page ?? 10,
      ...(params.type && { type: params.type }),
      ...(params.state && { state: params.state }),
      ...(params.priority && { priority: params.priority }),
      ...(params.area_id && { area_id: params.area_id }),
      ...(params.sub_area_id && { sub_area_id: params.sub_area_id }),
      ...(params.queue_owner_id && { queue_owner_id: params.queue_owner_id }),
      ...(params.technician_id && { technician_id: params.technician_id }),
      ...(params.order && { order: params.order }),
      ...(params.sort_by && { sort_by: params.sort_by }),
    },
  }) as unknown as Promise<WorkOrderDashboardEnvelope>;
};

export const getTechnicians = (
  payload: ListTechniciansParams = {},
): Promise<ResponseEnvelope<{ items: any[] }>> => {
  const body: Record<string, string> = {};
  if (payload.branch_id) body.branch_id = payload.branch_id;
  if (payload.team_leader_id) body.team_leader_id = payload.team_leader_id;

  return userServiceApi.post(
    `${BASE}/technicians/list`,
    body,
  ) as unknown as Promise<ResponseEnvelope<{ items: any[] }>>;
};

export const getTechnicianLatestLocations = (
  branch_id?: string,
): Promise<ResponseEnvelope<TechnicianLatestLocationsResponse>> => {
  return userServiceApi.get(`${BASE}/technicians/latest-locations`, {
    params: { branch_id },
  }) as unknown as Promise<ResponseEnvelope<TechnicianLatestLocationsResponse>>;
};

export const getWorkOrder = (id: string): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.get(`${BASE}/work-orders/${id}`) as unknown as Promise<
    WorkOrderDetailEnvelope
  >;
};

export const getWorkOrderTimeline = (
  id: string,
): Promise<WorkOrderTimelineEnvelope> => {
  return userServiceApi.get(
    `${BASE}/work-orders/${id}/timeline`,
  ) as unknown as Promise<WorkOrderTimelineEnvelope>;
};

// --- Hooks ---
type UseWorkOrderListOptions = {
  params?: WorkOrderListParams;
  queryConfig?: any;
};

export const useWorkOrderList = ({
  params = {},
  queryConfig,
}: UseWorkOrderListOptions = {}) => {
  return useQuery<{
    items: WorkOrderDashboardItem[];
    summary: WorkOrderDashboardSummary;
    metadata: Metadata;
  }>({
    queryKey: TECHNICIAN_KEYS.workOrders(params),
    queryFn: async () => {
      const res = await getWorkOrders(params);
      return {
        items: res.data?.items ?? [],
        summary: res.data?.summary ?? {
          total: 0,
          by_state: {} as never,
          by_type: {} as never,
        },
        metadata: res.metadata,
      };
    },
    placeholderData: {
      items: [],
      summary: { total: 0, by_state: {} as never, by_type: {} as never },
      metadata: { count: 0, page: 1, per_page: 10 },
    } as any,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseTechnicianListOptions = {
  params?: ListTechniciansParams;
  queryConfig?: QueryConfig<typeof getTechnicians>;
};

export const useTechnicianList = ({
  params = {},
  queryConfig,
}: UseTechnicianListOptions = {}) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.list(params),
    queryFn: async () => (await getTechnicians(params)).data?.items ?? [],
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

export const useTechnicianLatestLocations = (
  branch_id?: string,
  queryConfig?: any,
) => {
  return useQuery<TechnicianLatestLocation[]>({
    queryKey: TECHNICIAN_KEYS.latestLocations(branch_id),
    queryFn: async () => (await getTechnicianLatestLocations(branch_id)).data.items ?? [],
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseWorkOrderOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getWorkOrder>;
};

export const useWorkOrder = ({ id, queryConfig }: UseWorkOrderOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.workOrder(id),
    queryFn: async () => (await getWorkOrder(id)).data,
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseWorkOrderTimelineOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getWorkOrderTimeline>;
};

export const useWorkOrderTimeline = ({
  id,
  queryConfig,
}: UseWorkOrderTimelineOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.workOrderTimeline(id),
    queryFn: async () => (await getWorkOrderTimeline(id)).data.items ?? [],
    enabled: !!id,
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};
