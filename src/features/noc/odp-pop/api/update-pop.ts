import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { PopFormValues } from "../types/pop";
import { POP_KEYS } from "./key";

export const updatePop = ({ id, data }: { id: string; data: PopFormValues }): Promise<any> => {
    const payload = {
        ...data,
        gps_lat: parseFloat(data.gps_lat) || 0,
        gps_lng: parseFloat(data.gps_lng) || 0,
    };
    return api.patch(`${services.networking}/monitoring/topology/pops/${id}`, payload);
};

type UseUpdatePopOptions = {
    mutationConfig?: MutationConfig<typeof updatePop>;
};

export const useUpdatePop = ({ mutationConfig }: UseUpdatePopOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: updatePop,
        onSuccess: (data, variables, context) => {
            toast.success("POP updated successfully");

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
                || "Failed to update POP";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        },
    });
};
