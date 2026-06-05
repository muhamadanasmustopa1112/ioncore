import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  UpdateTransferStatusRequest,
  UpdateTransferStatusResponse,
} from "../types/transfers";

const BASE = `${services.warehouse}`;

export const updateTransferStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateTransferStatusRequest;
}): Promise<UpdateTransferStatusResponse> => {
  return userServiceApi.post(
    `${BASE}/warehouse/frontend/transfers/${id}/status`,
    payload
  );
};

type UseUpdateTransferStatusOptions = {
  mutationConfig?: MutationConfig<typeof updateTransferStatus>;
};

export const useUpdateTransferStatus = ({
  mutationConfig,
}: UseUpdateTransferStatusOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransferStatus,
    onSuccess: (data, variables, context) => {
      toast.success("Transfer updated");
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.transfers(),
        exact: false,
        refetchType: "active",
      });
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.transferDetail(variables.id),
        refetchType: "active",
      });
      mutationConfig?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update transfer");
      mutationConfig?.onError?.(error, variables, context);
    },
    ...mutationConfig,
  });
};
