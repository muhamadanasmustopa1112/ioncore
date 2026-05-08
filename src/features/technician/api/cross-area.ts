import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import type {
  CreateCrossAreaPayload,
  ResponseEnvelope,
  ReviewCrossAreaPayload,
} from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

const BASE = services.technical;

// --- API Functions ---
export const createCrossAreaRequest = ({
  workOrderId,
  data,
}: {
  workOrderId: string;
  data: CreateCrossAreaPayload;
}): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${workOrderId}/cross-area-requests`,
    data,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const approveCrossAreaRequest = ({
  id,
  data,
}: {
  id: string;
  data: ReviewCrossAreaPayload;
}): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.post(
    `${BASE}/cross-area-requests/${id}/approve`,
    data,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const rejectCrossAreaRequest = ({
  id,
  data,
}: {
  id: string;
  data: ReviewCrossAreaPayload;
}): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.post(
    `${BASE}/cross-area-requests/${id}/reject`,
    data,
  ) as unknown as Promise<ResponseEnvelope<any>>;
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
type UseCreateCrossAreaRequestOptions = {
  mutationConfig?: MutationConfig<typeof createCrossAreaRequest>;
};

export const useCreateCrossAreaRequest = ({
  mutationConfig,
}: UseCreateCrossAreaRequestOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: createCrossAreaRequest,
    onSuccess: (data, variables, context) => {
      toast.success("Cross-area request created");
      invalidateWO(variables.workOrderId);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create cross-area request");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseApproveCrossAreaRequestOptions = {
  mutationConfig?: MutationConfig<typeof approveCrossAreaRequest>;
};

export const useApproveCrossAreaRequest = ({
  mutationConfig,
}: UseApproveCrossAreaRequestOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: approveCrossAreaRequest,
    onSuccess: (data, variables, context) => {
      toast.success("Cross-area request approved");
      invalidateWO();
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to approve");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseRejectCrossAreaRequestOptions = {
  mutationConfig?: MutationConfig<typeof rejectCrossAreaRequest>;
};

export const useRejectCrossAreaRequest = ({
  mutationConfig,
}: UseRejectCrossAreaRequestOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: rejectCrossAreaRequest,
    onSuccess: (data, variables, context) => {
      toast.success("Cross-area request rejected");
      invalidateWO();
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to reject");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
