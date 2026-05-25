import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import i18n from "@/i18n";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { BANDWIDTH_KEYS } from "./keys";

export const deleteBandwidth = ({ code }: { code: string }): Promise<any> => {
  return api.delete(`${services.networking}/ion-radius/service-plans/bandwidth/${code}/`);
};

type UseDeleteBandwidthOptions = {
  mutationConfig?: MutationConfig<typeof deleteBandwidth>;
};

export const useDeleteBandwidth = ({
  mutationConfig,
}: UseDeleteBandwidthOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteBandwidth,
    onSuccess: (data, variables, context) => {
      toast.success(i18n.t("nocBandwidth.toasts.deleteSuccess", "Bandwidth deleted successfully"));
      queryClient.invalidateQueries({
        queryKey: BANDWIDTH_KEYS.all(),
      });
      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const backendMsg = i18n.language === "id" ? error?.response?.data?.response?.message_id : error?.response?.data?.response?.message_en;
      const msg = backendMsg || error.message || i18n.t("nocBandwidth.toasts.deleteError", "Failed to delete bandwidth");
      toast.error(msg);
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
