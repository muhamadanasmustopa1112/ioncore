import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  CreatePurchaseReceiptRequest,
  PurchaseReceiptResponse,
} from "../types/purchase-receipt";

const BASE = `${services.warehouse}`;

export const createPurchaseReceipt = async (
  payload: CreatePurchaseReceiptRequest
): Promise<PurchaseReceiptResponse> => {
  return userServiceApi.post(`${BASE}/warehouse/purchases`, payload);
};

type UseCreatePurchaseReceiptOptions = {
  mutationConfig?: MutationConfig<typeof createPurchaseReceipt>;
};

export const useCreatePurchaseReceipt = ({
  mutationConfig,
}: UseCreatePurchaseReceiptOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPurchaseReceipt,
    onSuccess: (data, variables, context) => {
      toast.success("Purchase receipt created");
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      mutationConfig?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create purchase receipt");
      mutationConfig?.onError?.(error, variables, context);
    },
    ...mutationConfig,
  });
};