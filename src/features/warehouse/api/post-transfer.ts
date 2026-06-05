import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  CreateTransferRequest,
  CreateTransferResponse,
} from "../types/transfers";

const BASE = `${services.warehouse}`;

export const createTransfer = async (
  payload: CreateTransferRequest
): Promise<CreateTransferResponse> => {
  return userServiceApi.post(`${BASE}/warehouse/transfers`, payload);
};

type UseCreateTransferOptions = {
  mutationConfig?: MutationConfig<typeof createTransfer>;
};

export const useCreateTransfer = ({
  mutationConfig,
}: UseCreateTransferOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransfer,
    onSuccess: (data, variables, context) => {
      toast.success("Transfer created");
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.transfers(),
        exact: false,
        refetchType: "active",
      });
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });
      mutationConfig?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create transfer");
      mutationConfig?.onError?.(error, variables, context);
    },
    ...mutationConfig,
  });
};
