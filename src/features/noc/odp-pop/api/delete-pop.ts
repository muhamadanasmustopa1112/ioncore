import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";

import { POP_KEYS } from "./key";

export const deletePop = ({ id }: { id: string }): Promise<any> => {
    return api.delete(`${services.networking}/monitoring/topology/pops/${id}`);
};

type UseDeletePopOptions = {
    mutationConfig?: MutationConfig<typeof deletePop>;
};

export const useDeletePop = ({ mutationConfig }: UseDeletePopOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: deletePop,
        onSuccess: (data, variables, context) => {
            toast.success("POP deleted successfully");

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
                || "Failed to delete POP";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        },
    });
};
