import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import i18n from "@/i18n";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { PROFILE_GROUP_KEYS } from "./keys";

export const deleteProfileGroup = (code: string): Promise<any> => {
  return api.delete(`${services.networking}/ion-radius/service-plans/profile-groups/${code}/`);
};

type UseDeleteProfileGroupOptions = {
  mutationConfig?: MutationConfig<typeof deleteProfileGroup>;
};

export const useDeleteProfileGroup = ({ mutationConfig }: UseDeleteProfileGroupOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: deleteProfileGroup,
    onSuccess: (data, variables, context) => {
      toast.success(i18n.t("nocProfileGroup.toasts.deleteSuccess", "Profile Group deleted successfully"));

      queryClient.invalidateQueries({
        queryKey: PROFILE_GROUP_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const backendMsg = i18n.language === "id" ? error?.response?.data?.response?.message_id : error?.response?.data?.response?.message_en;
      const msg = backendMsg || error.message || i18n.t("nocProfileGroup.toasts.deleteError", "Failed to delete profile group");
      toast.error(msg);

      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
