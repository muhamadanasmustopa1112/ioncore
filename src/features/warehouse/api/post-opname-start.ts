import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MutationConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  StartOpnameRequest,
  StartOpnameResponse,
} from "../types/opnames";

const BASE = `${services.warehouse}`;

export const startOpname = async (
  payload: StartOpnameRequest
): Promise<StartOpnameResponse> => {
  return userServiceApi.post(`${BASE}/warehouse/opnames/start`, payload);
};

type UseStartOpnameOptions = {
  mutationConfig?: MutationConfig<typeof startOpname>;
};

export const useStartOpname = ({
  mutationConfig,
}: UseStartOpnameOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startOpname,
    onSuccess: (data, variables, context) => {
      toast.success("Opname session started");
      void queryClient.invalidateQueries({
        queryKey: WAREHOUSE_KEYS.opnames(),
        exact: false,
        refetchType: "active",
      });
      mutationConfig?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Failed to start opname");
      mutationConfig?.onError?.(error, variables, context);
    },
    ...mutationConfig,
  });
};
