import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  CreateReturnRequest,
  CreateReturnResponse,
} from "../types/returns";

const BASE = `${services.warehouse}`;

export const createReturn = async (
  payload: CreateReturnRequest
): Promise<CreateReturnResponse> => {
  return userServiceApi.post(`${BASE}/warehouse/returns`, payload);
};

type UseCreateReturnOptions = {
  mutationConfig?: MutationConfig<typeof createReturn>;
};

export const useCreateReturn = ({
  mutationConfig,
}: UseCreateReturnOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReturn,
    onSuccess: (data, variables, context) => {
      toast.success("Return created");
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.returns(),
        exact: false,
        refetchType: "active",
      });
      mutationConfig?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to create return");
      mutationConfig?.onError?.(error, variables, context);
    },
    ...mutationConfig,
  });
};
