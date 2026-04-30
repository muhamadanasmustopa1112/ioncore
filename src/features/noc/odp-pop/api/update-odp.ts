import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { getQueryClient } from "@/lib/get-query-client";
import { MutationConfig } from "@/lib/react-query";
import { OdpFormValues, OdpPayload } from "../types/odp";
import { ODP_KEYS } from "./key";

export const updateOdp = ({ id, data }: { id: string; data: OdpPayload }): Promise<any> => {
    return api.patch(`${services.networking}/monitoring/topology/odps/${id}`, data);
};

type UseUpdateOdpOptions = {
    mutationConfig?: MutationConfig<typeof updateOdp>;
};

export const useUpdateOdp = ({ mutationConfig }: UseUpdateOdpOptions = {}) => {
    const queryClient = getQueryClient();
    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        ...restConfig,
        mutationFn: updateOdp,
        onSuccess: (data, variables, context) => {
            toast.success("ODP updated successfully");
            queryClient.invalidateQueries({
                queryKey: ODP_KEYS.all(),
                exact: false,
                refetchType: "active",
            });
            onSuccess?.(data, variables, context);
        },
        onError: (error: any, variables, context) => {
            const msg = error?.response?.data?.response?.message_en
                || error.message
                || "Failed to update ODP";
            toast.error(msg);
            mutationConfig?.onError?.(error, variables, context);
        },
    });
};
