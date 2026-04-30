import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";
import { OltFormValues } from "../types/olt";
import { OLT_KEYS } from "./key";

export const updateOlt = ({ id, data }: { id: string; data: OltFormValues }): Promise<any> => {
    return api.patch(`${services.networking}/monitoring/topology/olts/${id}`, data);
};

type UseUpdateOltOptions = {
    mutationConfig?: MutationConfig<typeof updateOlt>;
};

export const useUpdateOlt = ({ mutationConfig }: UseUpdateOltOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: updateOlt,
        onSuccess: (data, variables, context) => {
            toast.success("OLT updated successfully");
            queryClient.invalidateQueries({
                queryKey: OLT_KEYS.all(),
                exact: false,
                refetchType: "active",
            });
            onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
            const msg = error?.response?.data?.response?.message_en
                || error.message
                || "Failed to update OLT";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        },
    });
};
