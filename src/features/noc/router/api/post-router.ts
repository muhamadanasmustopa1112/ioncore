import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { CreateRouterRequest, CreateRouterResponse } from "../types";
import { ROUTER_KEYS } from "./keys";

// --- Schema ---
export const routerSchema = z.object({
  shortname: z.string().min(1, "Router Name (Shortname) is required"),
  nasname: z.string().min(1, "Router Address (NAS Name) is required"),
  time_zone: z.string().min(1, "Time Zone is required"),
  ports: z.string().min(1, "Port is required"),
  secret: z.string().min(1, "Secret is required"),
  description: z.string().min(1, "Description is required"),
  community: z.string(),
  server: z.string(),
  type: z.string(),
});

export type RouterFormData = z.infer<typeof routerSchema>;

// --- API Function ---
export const createRouter = (data: CreateRouterRequest): Promise<CreateRouterResponse> => {
  return api.post(`${services.networking}/ion-radius/routers/`, data);
};

// --- Mutation Hook ---
type UseCreateRouterOptions = {
  mutationConfig?: MutationConfig<typeof createRouter>;
};

export const useCreateRouter = ({ mutationConfig }: UseCreateRouterOptions = {}) => {
  const queryClient = getQueryClient();
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: createRouter,
    onSuccess: (data, variables, context) => {
      // Automatic success feedback
      toast.success("Router created successfully");

      // Robust table refresh logic
      queryClient.invalidateQueries({
        queryKey: ROUTER_KEYS.all(),
        exact: false,
        refetchType: "active",
      });

      // Execute custom callback if provided
      onSuccess?.(data, variables, context);
    },
    onError: (error: any, variables, context) => {
      // Automatic error feedback
      const msg = error?.response?.data?.response?.message_en || error.message || "Failed to create router";
      toast.error(msg);

      // Execute custom callback if provided
      mutationConfig?.onError?.(error, variables, context);
    }
  });
};
