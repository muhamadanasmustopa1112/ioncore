import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreateProfileGroupRequest, CreateProfileGroupResponse } from "../types";
import { PROFILE_GROUP_KEYS } from "./keys";

export const profileGroupSchema = z.object({
  code: z.string().min(1, "Code is required"),
  data_owner: z.string().min(1, "Data Owner is required"),
  first_address: z.string().min(1, "First Address is required"),
  last_address: z.string().min(1, "Last Address is required"),
  local_address: z.string().min(1, "Local Address is required"),
  module: z.string().min(1, "Module is required"),
  name: z.string().min(1, "Name is required"),
  parent_pool: z.string().min(1, "Parent Pool is required"),
  profile_type: z.string().min(1, "Profile Type is required"),
  router_nas: z.string().min(1, "Router NAS is required"),
});

export type ProfileGroupFormData = z.infer<typeof profileGroupSchema>;

export const createProfileGroup = (data: CreateProfileGroupRequest): Promise<CreateProfileGroupResponse> => {
  return api.post(`${services.networking}/ion-radius/service-plans/profile-groups/`, data);
};

type UseCreateProfileGroupOptions = {
  mutationConfig?: MutationConfig<typeof createProfileGroup>;
};

export const useCreateProfileGroup = ({ mutationConfig }: UseCreateProfileGroupOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createProfileGroup,
    onSuccess: (data, variables, context) => {
      toast.success("Profile Group created successfully");

      queryClient.invalidateQueries({
        queryKey: PROFILE_GROUP_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to create profile group";
      toast.error(msg);

      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
