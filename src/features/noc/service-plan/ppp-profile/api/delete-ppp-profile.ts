import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { PPP_PROFILE_KEYS } from "./keys";

export const deletePPPProfile = ({ code }: { code: string }): Promise<any> => {
  return api.delete(`${services.networking}/ion-radius/service-plans/ppp-profiles/${code}/`);
};

type UseDeletePPPProfileOptions = {
  mutationConfig?: MutationConfig<typeof deletePPPProfile>;
};

export const useDeletePPPProfile = ({ mutationConfig }: UseDeletePPPProfileOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deletePPPProfile,
    onSuccess: (data, variables, context) => {
      toast.success("PPP Profile deleted successfully");

      queryClient.invalidateQueries({
        queryKey: PPP_PROFILE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to delete PPP Profile";
      toast.error(msg);
      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
