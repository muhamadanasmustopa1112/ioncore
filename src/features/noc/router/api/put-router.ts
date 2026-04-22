import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreateRouterRequest, CreateRouterResponse } from "../types";
import { ROUTER_KEYS } from "./keys";

export const updateRouter = ({ id, data }: { id: string; data: CreateRouterRequest }): Promise<CreateRouterResponse> => {
  return api.patch(`${services.networking}/ion-radius/routers/${id}/`, data);
};

type UseUpdateRouterOptions = {
  mutationConfig?: MutationConfig<typeof updateRouter>;
};

export const useUpdateRouter = ({ mutationConfig }: UseUpdateRouterOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateRouter,
    onSuccess: (data, variables, context) => {
      toast.success("Router updated successfully");

      queryClient.invalidateQueries({
        queryKey: ROUTER_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to update router";
      toast.error(msg);
      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
