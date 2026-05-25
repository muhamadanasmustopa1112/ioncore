import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import i18n from "@/i18n";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreateProfileGroupRequest, CreateProfileGroupResponse } from "../types";
import { PROFILE_GROUP_KEYS } from "./keys";

export const updateProfileGroup = (code: string, data: Partial<CreateProfileGroupRequest>): Promise<CreateProfileGroupResponse> => {
  return api.patch(`${services.networking}/ion-radius/service-plans/profile-groups/${code}/`, data);
};

type UseUpdateProfileGroupOptions = {
  mutationConfig?: MutationConfig<(args: { code: string; data: Partial<CreateProfileGroupRequest> }) => Promise<CreateProfileGroupResponse>>;
};

export const useUpdateProfileGroup = ({ mutationConfig }: UseUpdateProfileGroupOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: ({ code, data }: { code: string; data: Partial<CreateProfileGroupRequest> }) => updateProfileGroup(code, data),
    onSuccess: (data, variables, context) => {
      toast.success(i18n.t("nocProfileGroup.toasts.updateSuccess", "Profile Group updated successfully"));

      queryClient.invalidateQueries({
        queryKey: PROFILE_GROUP_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const backendMsg = i18n.language === "id" ? error?.response?.data?.response?.message_id : error?.response?.data?.response?.message_en;
      const msg = backendMsg || error.message || i18n.t("nocProfileGroup.toasts.updateError", "Failed to update profile group");
      toast.error(msg);

      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
