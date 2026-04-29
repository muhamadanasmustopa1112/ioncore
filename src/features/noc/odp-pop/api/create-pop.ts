import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { PopFormValues } from "../types/pop";
import { POP_KEYS } from "./key";

export const createPop = (data: PopFormValues): Promise<any> => {
    const payload = {
        ...data,
        gps_lat: parseFloat(data.gps_lat) || 0,
        gps_lng: parseFloat(data.gps_lng) || 0,
    };
    return api.post(`${services.networking}/monitoring/topology/pops`, payload);
};

type UseCreatePopOptions = {
    mutationConfig?: MutationConfig<typeof createPop>;
};

export const useCreatePop = ({ mutationConfig }: UseCreatePopOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: createPop,
        onSuccess: (data, variables, context) => {
            toast.success("POP created successfully");

            queryClient.invalidateQueries({
                queryKey: POP_KEYS.root(),
                exact: false,
                refetchType: "active",
            });

            onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
            const msg = error?.response?.data?.response?.message_en
                || error.message
                || "Failed to create POP";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        },
    });
};
