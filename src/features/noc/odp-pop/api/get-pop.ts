import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { POP_KEYS } from "./key";
import { PopParams, PopResponse } from "../types/pop";

export const getPop = (params: PopParams): Promise<PopResponse> => {
    return api.get(`${services.networking}/odp-pop/pops`, { params });
};

export const getPopQueryOptions = (params: PopParams) => {
    return queryOptions({
        queryKey: POP_KEYS.list(params),
        queryFn: () => getPop(params),
    });
};

type UsePopOptions = {
    params: PopParams;
    queryConfig?: QueryConfig<typeof getPopQueryOptions>;
};

export const usePop = ({ params, queryConfig }: UsePopOptions) => {
    return useQuery({
        ...getPopQueryOptions(params),
        ...queryConfig,
    });
};
