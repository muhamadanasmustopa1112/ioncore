import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";
import { PPP_CUSTOMER_KEYS } from "./keys";
import { CreatePPPCustomerRequest, CreatePPPCustomerResponse } from "../types";

export const pppCustomerSchema = z.object({
    address: z.string().min(1, "address is required"),
    auth_status: z.string().min(1, "Auth Status is required"),
    bandwidth: z.string().min(1, "Bandwid is required"),
    bind_mac: z.string().min(1, "Port is required"),
    created_at: z.string().min(1, "Secret is required"),
    email: z.email(),
    expired_on: z.string(),
    fullname: z.string(),
    mac_address: z.string(),
    member_id: z.string(),
    method: z.string(),
    nasporttype: z.string(),
    note: z.string(),
    owner_name: z.string(),
    password: z.string(),
    payment_type: z.string(),
    phonenumber: z.string(),
    plan_name: z.string(),
    remote_address: z.string(),
    renewed_on: z.string(),
    server_name: z.string(),
    servicetype: z.string(),
    total: z.string(),
    trx_invoice: z.string(),
    trx_status: z.string(),
    username: z.string(),

});

export type PPPCustomerFormData = z.infer<typeof pppCustomerSchema>;

export const createPPPCustomer = (data: CreatePPPCustomerRequest): Promise<CreatePPPCustomerResponse> => {
    return api.post(`${services.networking}/ion-radius/customers/ppp-users/`, data);
};

type UseCreatePPPCustomerOptions = {
    mutationConfig?: MutationConfig<typeof createPPPCustomer>;
};

export const usePPPCustomer = ({ mutationConfig }: UseCreatePPPCustomerOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: createPPPCustomer,
        onSuccess: (data, variables, context) => {
            toast.success("PPP Customer created successfully");

            queryClient.invalidateQueries({
                queryKey: PPP_CUSTOMER_KEYS.all(),
                exact: false,
                refetchType: "active",
            });

            onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
            const msg = error?.response?.data?.response?.message_en || error.message || "Failed to create PPP Customoer";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        }
    });
};
