import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Profile Group updated successfully");

      queryClient.invalidateQueries({
        queryKey: PROFILE_GROUP_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to update profile group";
      toast.error(msg);

      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
