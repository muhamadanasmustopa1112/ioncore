import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  CreateDispatchRequest,
  CreateDispatchResponse,
} from "../types/dispatches";

const BASE = `${services.warehouse}`;

export const createDispatch = async (
  payload: CreateDispatchRequest
): Promise<CreateDispatchResponse> => {
  return userServiceApi.post(`${BASE}/warehouse/dispatches`, payload);
};

type UseCreateDispatchOptions = {
  mutationConfig?: MutationConfig<typeof createDispatch>;
};

export const useCreateDispatch = ({
  mutationConfig,
}: UseCreateDispatchOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDispatch,
    onSuccess: (data, variables, context) => {
      toast.success("Dispatch created");
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.dispatches(),
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
      toast.error("Failed to create dispatch");
      mutationConfig?.onError?.(error, variables, context);
    },
    ...mutationConfig,
  });
};
