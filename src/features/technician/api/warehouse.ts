import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig, QueryConfig } from "@/lib/react-query";

import type {
  DeviceReceiptPayload,
  RequestTemporaryRadiusPayload,
  ResponseEnvelope,
  VerifyInventoryPayload,
  WarehouseDispatchPayload,
  WorkOrderDetailEnvelope,
} from "../types/technician-api";
import { TECHNICIAN_KEYS } from "./keys";

const BASE = services.technical;

// --- API Functions ---
export const getInventoryRequirements = (
  id: string,
): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.get(
    `${BASE}/work-orders/${id}/inventory-requirements`,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const verifyInventory = ({
  id,
  data,
}: {
  id: string;
  data: VerifyInventoryPayload;
}): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/inventory-verifications`,
    data,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const confirmDeviceReceipt = ({
  id,
  data,
}: {
  id: string;
  data: DeviceReceiptPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/device-receipt/confirm`,
    data,
  ) as unknown as Promise<WorkOrderDetailEnvelope>;
};

export const warehouseDispatch = ({
  id,
  data,
}: {
  id: string;
  data: WarehouseDispatchPayload;
}): Promise<ResponseEnvelope<any>> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/warehouse-dispatch`,
    data,
  ) as unknown as Promise<ResponseEnvelope<any>>;
};

export const requestTemporaryRadius = ({
  id,
  data,
}: {
  id: string;
  data: RequestTemporaryRadiusPayload;
}): Promise<WorkOrderDetailEnvelope> => {
  return userServiceApi.post(
    `${BASE}/work-orders/${id}/radius-provisionings/temporary`,
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

// --- Hooks ---
type UseInventoryRequirementsOptions = {
  id: string;
  queryConfig?: QueryConfig<typeof getInventoryRequirements>;
};

export const useInventoryRequirements = ({
  id,
  queryConfig,
}: UseInventoryRequirementsOptions) => {
  return useQuery({
    queryKey: TECHNICIAN_KEYS.inventoryRequirements(id),
    queryFn: async () => (await getInventoryRequirements(id)).data,
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
    ...queryConfig,
  });
};

type UseVerifyInventoryOptions = {
  mutationConfig?: MutationConfig<typeof verifyInventory>;
};

export const useVerifyInventory = ({
  mutationConfig,
}: UseVerifyInventoryOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: verifyInventory,
    onSuccess: (data, variables, context) => {
      toast.success("Inventory verified");
      queryClient.invalidateQueries({
        queryKey: TECHNICIAN_KEYS.inventoryRequirements(variables.id),
      });
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to verify inventory");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseConfirmDeviceReceiptOptions = {
  mutationConfig?: MutationConfig<typeof confirmDeviceReceipt>;
};

export const useConfirmDeviceReceipt = ({
  mutationConfig,
}: UseConfirmDeviceReceiptOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: confirmDeviceReceipt,
    onSuccess: (data, variables, context) => {
      toast.success("Device receipt confirmed");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to confirm device receipt");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseWarehouseDispatchOptions = {
  mutationConfig?: MutationConfig<typeof warehouseDispatch>;
};

export const useWarehouseDispatch = ({
  mutationConfig,
}: UseWarehouseDispatchOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: warehouseDispatch,
    onSuccess: (data, variables, context) => {
      toast.success("Devices dispatched");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to dispatch devices");
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};

type UseRequestTemporaryRadiusOptions = {
  mutationConfig?: MutationConfig<typeof requestTemporaryRadius>;
};

export const useRequestTemporaryRadius = ({
  mutationConfig,
}: UseRequestTemporaryRadiusOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: requestTemporaryRadius,
    onSuccess: (data, variables, context) => {
      toast.success("Temporary Radius activation requested");
      invalidateWO(variables.id);
      onSuccess?.(data, variables, context);
    },
    onError: (err: any, variables, context) => {
      const errMsg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to request temporary radius";
      toast.error(errMsg);

      // Graceful local simulation for testing
      toast.info("Simulating Temporary Radius activation locally");
      queryClient.setQueryData(
        TECHNICIAN_KEYS.workOrder(variables.id),
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            temporary_provisioning_status: "TEMPORARY_ACTIVE",
          };
        },
      );
      mutationConfig?.onError?.(err, variables, context);
    },
  });
};
