import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import type {
  AcceptWorkOrderPayload,
  CancelWorkOrderPayload,
  CreateWorkOrderPayload,
  CustomerSignOffConfirmPayload,
  CustomerSignOffRequestPayload,
  IssueReportPayload,
  JourneyEventPayload,
  SubmitBASTPayload,
  UpdateWorkOrderPayload,
  UpsertProofOfWorkPayload,
  UpsertResolutionLogPayload,
  WorkOrderDetailEnvelope,
} from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

const BASE = services.technical;

// --- API Functions ---
export const createWorkOrder = (
  payload: CreateWorkOrderPayload,
): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders`,
    payload,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const updateWorkOrder = ({
  id,
  data,
}: {
  id: string;
  data: UpdateWorkOrderPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.patch(
    `${BASE}/work-orders/${id}`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const cancelWorkOrder = ({
  id,
  data,
}: {
  id: string;
  data: CancelWorkOrderPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/cancel`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const acceptWorkOrder = ({
  id,
  data,
}: {
  id: string;
  data: AcceptWorkOrderPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/accept`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const startJourney = ({
  id,
  data,
}: {
  id: string;
  data: JourneyEventPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/journey/start`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const recordArrival = ({
  id,
  data,
}: {
  id: string;
  data: JourneyEventPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/arrival`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const upsertProofOfWork = ({
  id,
  data,
}: {
  id: string;
  data: UpsertProofOfWorkPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/proof-of-work`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const upsertResolutionLog = ({
  id,
  data,
}: {
  id: string;
  data: UpsertResolutionLogPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/resolution-log`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const reportIssue = ({
  id,
  data,
}: {
  id: string;
  data: IssueReportPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/issue-report`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const requestCustomerSignOff = ({
  id,
  data,
}: {
  id: string;
  data: CustomerSignOffRequestPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/customer-sign-off/request`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const confirmCustomerSignOff = ({
  id,
  data,
}: {
  id: string;
  data: CustomerSignOffConfirmPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/customer-sign-off/confirm`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const submitBAST = ({
  id,
  data,
}: {
  id: string;
  data: SubmitBASTPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/bast/submit`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

// --- Helper for Invalidation ---
const invalidateWO = (id?: string) => {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.all });
  if (id) {
    queryClient.invalidateQueries({ queryKey: TECHNICIAN_KEYS.workOrder(id) });
  }
};

// --- Mutation Hooks ---
type UseCreateWorkOrderOptions = {
  mutationConfig?: MutationConfig<typeof createWorkOrder>;
};

export const useCreateWorkOrder = ({
  mutationConfig,
}: UseCreateWorkOrderOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: createWorkOrder,
    onSuccess: (data, variables, context) => {
      toast.success("Work order created");
      invalidateWO();
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create work order");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseUpdateWorkOrderOptions = {
  mutationConfig?: MutationConfig<typeof updateWorkOrder>;
};

export const useUpdateWorkOrder = ({
  mutationConfig,
}: UseUpdateWorkOrderOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: updateWorkOrder,
    onSuccess: (data, variables, context) => {
      toast.success("Work order updated");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update work order");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseCancelWorkOrderOptions = {
  mutationConfig?: MutationConfig<typeof cancelWorkOrder>;
};

export const useCancelWorkOrder = ({
  mutationConfig,
}: UseCancelWorkOrderOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: cancelWorkOrder,
    onSuccess: (data, variables, context) => {
      toast.success("Work order cancelled");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to cancel work order");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseAcceptWorkOrderOptions = {
  mutationConfig?: MutationConfig<typeof acceptWorkOrder>;
};

export const useAcceptWorkOrder = ({
  mutationConfig,
}: UseAcceptWorkOrderOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: acceptWorkOrder,
    onSuccess: (data, variables, context) => {
      toast.success("Work order accepted");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to accept");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseStartJourneyOptions = {
  mutationConfig?: MutationConfig<typeof startJourney>;
};

export const useStartJourney = ({
  mutationConfig,
}: UseStartJourneyOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: startJourney,
    onSuccess: (data, variables, context) => {
      toast.success("Journey started");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to start journey");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseRecordArrivalOptions = {
  mutationConfig?: MutationConfig<typeof recordArrival>;
};

export const useRecordArrival = ({
  mutationConfig,
}: UseRecordArrivalOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: recordArrival,
    onSuccess: (data, variables, context) => {
      toast.success("Arrival recorded");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to record arrival");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseUpsertProofOfWorkOptions = {
  mutationConfig?: MutationConfig<typeof upsertProofOfWork>;
};

export const useUpsertProofOfWork = ({
  mutationConfig,
}: UseUpsertProofOfWorkOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: upsertProofOfWork,
    onSuccess: (data, variables, context) => {
      toast.success("Proof of work saved");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to save proof of work");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseUpsertResolutionLogOptions = {
  mutationConfig?: MutationConfig<typeof upsertResolutionLog>;
};

export const useUpsertResolutionLog = ({
  mutationConfig,
}: UseUpsertResolutionLogOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: upsertResolutionLog,
    onSuccess: (data, variables, context) => {
      toast.success("Resolution log saved");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to save resolution log");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseReportIssueOptions = {
  mutationConfig?: MutationConfig<typeof reportIssue>;
};

export const useReportIssue = ({
  mutationConfig,
}: UseReportIssueOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: reportIssue,
    onSuccess: (data, variables, context) => {
      toast.success("Issue reported");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to report issue");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseRequestCustomerSignOffOptions = {
  mutationConfig?: MutationConfig<typeof requestCustomerSignOff>;
};

export const useRequestCustomerSignOff = ({
  mutationConfig,
}: UseRequestCustomerSignOffOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: requestCustomerSignOff,
    onSuccess: (data, variables, context) => {
      toast.success("Sign-off requested");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to request sign-off");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseConfirmCustomerSignOffOptions = {
  mutationConfig?: MutationConfig<typeof confirmCustomerSignOff>;
};

export const useConfirmCustomerSignOff = ({
  mutationConfig,
}: UseConfirmCustomerSignOffOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: confirmCustomerSignOff,
    onSuccess: (data, variables, context) => {
      toast.success("Sign-off confirmed");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to confirm sign-off");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseSubmitBASTOptions = {
  mutationConfig?: MutationConfig<typeof submitBAST>;
};

export const useSubmitBAST = ({ mutationConfig }: UseSubmitBASTOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: submitBAST,
    onSuccess: (data, variables, context) => {
      toast.success("BAST submitted");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to submit BAST");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
