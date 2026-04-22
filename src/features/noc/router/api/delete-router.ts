import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { ROUTER_KEYS } from "./keys";

export const deleteRouter = ({ id }: { id: string }): Promise<any> => {
  return api.delete(`${services.networking}/ion-radius/routers/${id}/`);
};

type UseDeleteRouterOptions = {
  mutationConfig?: MutationConfig<typeof deleteRouter>;
};

export const useDeleteRouter = ({ mutationConfig }: UseDeleteRouterOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteRouter,
    onSuccess: (data, variables, context) => {
      toast.success("Router deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ROUTER_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to delete router";
      toast.error(msg);
      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
