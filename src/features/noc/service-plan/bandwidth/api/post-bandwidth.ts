import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreateBandwidthRequest, CreateBandwidthResponse } from "../types/bandwidth";
import { BANDWIDTH_KEYS } from "./keys";

// --- Schema ---
export const bandwidthSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  data_owner: z.string().min(1, "Data owner is required"),
  download_mbps: z.string().min(1).default("0"),
  upload_mbps: z.string().min(1).default("0"),
  min_rate_up: z.string().min(1).default("0"),
  max_rate_up: z.string().min(1).default("0"),
  min_rate_down: z.string().min(1).default("0"),
  max_rate_down: z.string().min(1).default("0"),
  min_rate_up_unit: z.string().default("Mbps"),
  max_rate_up_unit: z.string().default("Mbps"),
  min_rate_down_unit: z.string().default("Mbps"),
  max_rate_down_unit: z.string().default("Mbps"),
  rate_limit: z.string().optional().default(""),
  attributes: z.object({
    service_profile: z.string().default("residential"),
  }).optional(),
});

export type BandwidthFormData = z.infer<typeof bandwidthSchema>;

// --- API Function ---
export const createBandwidth = (
  data: CreateBandwidthRequest,
): Promise<CreateBandwidthResponse> => {
  return api.post(`${services.networking}/ion-radius/service-plans/bandwidth/`, data);
};

// --- Mutation Hook ---
type UseCreateBandwidthOptions = {
  mutationConfig?: MutationConfig<typeof createBandwidth>;
};

export const useCreateBandwidth = ({
  mutationConfig,
}: UseCreateBandwidthOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createBandwidth,
    onSuccess: (data, variables, context) => {
      // Automatic success feedback
      toast.success("Bandwidth created successfully");

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
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to create bandwidth";
      toast.error(msg);
      
      // Execute custom callback if provided
      mutationConfig?.onError?.(error, variables, context);
    },
  });
};
