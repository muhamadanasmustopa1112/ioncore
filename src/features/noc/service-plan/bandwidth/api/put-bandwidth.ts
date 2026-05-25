import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import i18n from "@/i18n";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreateBandwidthRequest, CreateBandwidthResponse } from "../types/bandwidth";
import { BANDWIDTH_KEYS } from "./keys";

export const updateBandwidth = ({
  code,
  data,
}: {
  code: string;
  data: CreateBandwidthRequest;
}): Promise<CreateBandwidthResponse> => {
  return api.patch(`${services.networking}/ion-radius/service-plans/bandwidth/${code}/`, data);
};

type UseUpdateBandwidthOptions = {
  mutationConfig?: MutationConfig<typeof updateBandwidth>;
};

export const useUpdateBandwidth = ({
  mutationConfig,
}: UseUpdateBandwidthOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updateBandwidth,
    onSuccess: (data, variables, context) => {
      // Automatic success feedback
      toast.success(i18n.t("nocBandwidth.toasts.updateSuccess", "Bandwidth updated successfully"));

      // Robust table refresh logic
      queryClient.invalidateQueries({
        queryKey: BANDWIDTH_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      // Execute custom callback if provided
      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      // Automatic error feedback
      const backendMsg = i18n.language === "id" ? error?.response?.data?.response?.message_id : error?.response?.data?.response?.message_en;
      const msg = backendMsg || error.message || i18n.t("nocBandwidth.toasts.updateError", "Failed to update bandwidth");
      toast.error(msg);
      
      // Execute custom callback if provided
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
