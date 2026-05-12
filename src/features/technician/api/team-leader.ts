import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig, QueryConfig } from "@/lib/react-query";

import type {
  AutoAssignWorkOrdersPayload,
  AutoAssignWorkOrdersResponse,
  PairingRecommendationPayload,
  PairingRecommendationResponse,
  ResponseEnvelope,
  TeamLeaderDashboardEnvelope,
  TeamLeaderDashboardResponse,
  TeamLeaderDashboardParams,
  UpsertPairingPayload,
  WorkOrderDetailEnvelope,
} from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

const BASE = services.technical;

// --- API Functions ---
export const getTeamLeaderDashboard = (
  params: TeamLeaderDashboardParams = {},
): Promise<TeamLeaderDashboardEnvelope> => {
  return userServiceApi.get(`${BASE}/team-leader/dashboard`, {
    params,
  }) as unknown as Promise<TeamLeaderDashboardEnvelope>;
};

export const autoAssignWorkOrders = (
  payload: AutoAssignWorkOrdersPayload,
): Promise<ResponseEnvelope<AutoAssignWorkOrdersResponse>> => {
  return userServiceApi.post(
    `${BASE}/work-orders/auto-assign`,
    payload,
  ) as unknown as Promise<ResponseEnvelope<AutoAssignWorkOrdersResponse>>;
};

export const assignPairing = ({
  id,
  data,
}: {
  id: string;
  data: UpsertPairingPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/pairing`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const updatePairing = ({
  id,
  data,
}: {
  id: string;
  data: UpsertPairingPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.patch(
    `${BASE}/work-orders/${id}/pairing`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const getPairingRecommendation = ({
  id,
  data,
}: {
  id: string;
  data: PairingRecommendationPayload;
}): Promise<ResponseEnvelope<PairingRecommendationResponse>> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/pairing/recommendation`,
    data,
  ) as unknown as Promise<ResponseEnvelope<PairingRecommendationResponse>>;
};

// --- Helper for Invalidation ---
const invalidateWO = (id?: string) => {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.all });
  if (id) {
    queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.workOrder(id) });
  }
};

// --- Hooks ---
type UseTeamLeaderDashboardOptions = {
  params?: TeamLeaderDashboardParams;
  queryConfig?: any;
};

export const useTeamLeaderDashboard = ({
  params = {},
  queryConfig,
}: UseTeamLeaderDashboardOptions = {}) => {
  return useQuery<TeamLeaderDashboardResponse>({
    queryKey: TECHNICIAN_KEYS.teamLeaderDashboard(params),
    queryFn: async () => (await getTeamLeaderDashboard(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseAutoAssignWorkOrdersOptions = {
  mutationConfig?: MutationConfig<typeof autoAssignWorkOrders>;
};

export const useAutoAssignWorkOrders = ({
  mutationConfig,
}: UseAutoAssignWorkOrdersOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: autoAssignWorkOrders,
    onSuccess: (data, variables, context) => {
      toast.success("Auto-assign triggered");
      invalidateWO();
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to auto-assign");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseAssignPairingOptions = {
  mutationConfig?: MutationConfig<typeof assignPairing>;
};

export const useAssignPairing = ({
  mutationConfig,
}: UseAssignPairingOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: assignPairing,
    onSuccess: (data, variables, context) => {
      toast.success("Pairing assigned");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to assign pairing");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseUpdatePairingOptions = {
  mutationConfig?: MutationConfig<typeof updatePairing>;
};

export const useUpdatePairing = ({
  mutationConfig,
}: UseUpdatePairingOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: updatePairing,
    onSuccess: (data, variables, context) => {
      toast.success("Pairing updated");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update pairing");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UsePairingRecommendationOptions = {
  mutationConfig?: MutationConfig<typeof getPairingRecommendation>;
};

export const usePairingRecommendation = ({
  mutationConfig,
}: UsePairingRecommendationOptions = {}) => {
  return useMutation({
    ...mutationConfig,
    mutationFn: getPairingRecommendation,
    onError: (error, variables, context) => {
      toast.error("Failed to fetch pairing recommendation");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
