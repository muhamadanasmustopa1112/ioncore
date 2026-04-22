import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreatePPPProfileRequest, CreatePPPProfileResponse } from "../types";
import { PPP_PROFILE_KEYS } from "./keys";

export const pppProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  data_owner: z.string().min(1, "Data owner is required"),
  plan_validity: z.string().min(1, "Plan validity is required"),
  shared_users: z.string().min(1, "Shared users is required"),
  service_type: z.string().min(1, "Service type is required"),
  privileges: z.string().min(1, "Privileges is required"),
  vat: z.string().min(1, "VAT is required"),
  profile_group: z.string().min(1, "Profile group is required"),
  promo: z.string().min(1, "Promo is required"),
  capital_price: z.string().min(1, "Capital price is required"),
  sell_price: z.string().min(1, "Sell price is required"),
  customer_count: z.string().min(1, "Customer count is required"),
  voucher_count: z.string().min(1, "Voucher count is required"),
  attributes: z.object({
    realm: z.string().min(1, "Realm is required"),
  }),
});

export type PPPProfileFormData = z.infer<typeof pppProfileSchema>;

export const createPPPProfile = (data: CreatePPPProfileRequest): Promise<CreatePPPProfileResponse> => {
  return api.post(`${services.networking}/ion-radius/service-plans/ppp-profiles/`, data);
};

type UseCreatePPPProfileOptions = {
  mutationConfig?: MutationConfig<typeof createPPPProfile>;
};

export const useCreatePPPProfile = ({ mutationConfig }: UseCreatePPPProfileOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createPPPProfile,
    onSuccess: (data, variables, context) => {
      toast.success("PPP Profile created successfully");

      queryClient.invalidateQueries({
        queryKey: PPP_PROFILE_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to create PPP Profile";
      toast.error(msg);

      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
