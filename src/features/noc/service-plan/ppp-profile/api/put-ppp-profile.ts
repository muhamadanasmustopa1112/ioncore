import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";

import { CreatePPPProfileRequest, CreatePPPProfileResponse } from "../types";
import { PPP_PROFILE_KEYS } from "./keys";

export const updatePPPProfile = ({
  code,
  data,
}: {
  code: string;
  data: CreatePPPProfileRequest;
}): Promise<CreatePPPProfileResponse> => {
  return api.put(`${services.networking}/ion-radius/service-plans/ppp-profiles/${code}/`, data);
};

type UseUpdatePPPProfileOptions = {
  mutationConfig?: MutationConfig<typeof updatePPPProfile>;
};

export const useUpdatePPPProfile = ({
  mutationConfig,
}: UseUpdatePPPProfileOptions = {}) => {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: updatePPPProfile,
    onSuccess: (data, variables, context) => {
      toast.success("PPP Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: PPP_PROFILE_KEYS.all(),
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to update PPP Profile";
      toast.error(msg);
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
