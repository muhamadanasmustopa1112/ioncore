import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";
import { PPP_CUSTOMER_KEYS } from "./keys";
import { CreatePPPCustomerRequest, CreatePPPCustomerResponse } from "../types";

export const updatePPPCustomer = ({ id, data }: { id: string, data: Partial<CreatePPPCustomerRequest> }): Promise<CreatePPPCustomerResponse> => {
    return api.patch(`${services.networking}/ion-radius/customers/ppp-users/${id}`, data);
};

type UseUpdatePPPCustomerOptions = {
    mutationConfig?: MutationConfig<typeof updatePPPCustomer>;
};

export const useUpdatePPPCustomer = ({ mutationConfig }: UseUpdatePPPCustomerOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: updatePPPCustomer,
        onSuccess: (data, variables, context) => {
            toast.success("PPP Customer updated successfully");

            queryClient.invalidateQueries({
                queryKey: PPP_CUSTOMER_KEYS.all(),
                exact: false,
                refetchType: "active",
            });

            onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
            const msg = error?.response?.data?.response?.message_en || error.message || "Failed to update PPP Customer";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        }
    });
};
