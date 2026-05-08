import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig, QueryConfig } from "@/lib/react-query";

import type {
  NOCQueueEnvelope,
  NOCQueueParams,
  ProcessNOCApprovalPayload,
  ResponseEnvelope,
} from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

const BASE = services.technical;

// --- API Functions ---
export const getNOCQueue = (
  params: NOCQueueParams = {},
): Promise<NOCQueueEnvelope> => {
  return userServiceApi.get(`${BASE}/work-orders/noc-queue`, {
    params: {
      ...(params.type && { type: params.type }),
      ...(params.branch_id && { branch_id: params.branch_id }),
    },
  }) as unknown as Promise<NOCQueueEnvelope>;
};

export const processNOCApproval = ({
  id,
  data,
}: {
  id: string;
  data: ProcessNOCApprovalPayload;
}): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/noc-approval`,
    data,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const getNOCApprovalLog = (
  id: string,
): Promise<ResponseEnvelope<{ items: any[] }>> => {
  return userServiceApi.get(
    `${BASE}/work-orders/${id}/noc-approval-log`,
  ) as unknown as Promise<ResponseEnvelope<{ items: any[] }>>;
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
type UseNOCQueueOptions = {
  params?: NOCQueueParams;
  queryConfig?: QueryConfig<typeof getNOCQueue>;
};

export const useNOCQueue = ({
  params = {},
  queryConfig,
}: UseNOCQueueOptions = {}) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.nocQueue(params),
    queryFn: async () => {
      const res = await getNOCQueue(params);
      return {
        items: res.data?.items ?? [],
        summary: res.data?.summary ?? {
          total: 0,
          installations: 0,
          maintenance: 0,
          terminations: 0,
        },
      };
    },
    placeholderData: {
      items: [],
      summary: { total: 0, installations: 0, maintenance: 0, terminations: 0 },
    } as any,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseProcessNOCApprovalOptions = {
  mutationConfig?: MutationConfig<typeof processNOCApproval>;
};

export const useProcessNOCApproval = ({
  mutationConfig,
}: UseProcessNOCApprovalOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: processNOCApproval,
    onSuccess: (data, variables, context) => {
      toast.success("NOC decision saved");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to process NOC approval");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseNOCApprovalLogOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getNOCApprovalLog>;
};

export const useNOCApprovalLog = ({
  id,
  queryConfig,
}: UseNOCApprovalLogOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.nocApprovalLog(id),
    queryFn: async () => (await getNOCApprovalLog(id)).data?.items ?? [],
    enabled: !!id,
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};
