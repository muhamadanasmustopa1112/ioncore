import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { POP_KEYS } from "./key";
import { PopParams, PopResponse } from "../types/pop";

export const getPop = (): Promise<PopResponse> => {
    return api.get(`${services.networking}/odp-pop/view-map/pops`);
};

export const getPopQueryOptions = () => {
    return queryOptions({
        queryKey: POP_KEYS.list(),
        queryFn: () => getPop(),
    });
};

type UsePopOptions = {
    queryConfig?: QueryConfig<typeof getPopQueryOptions>;
};

export const usePop = ({ queryConfig }: UsePopOptions = {}) => {
    return useQuery({
        ...getPopQueryOptions(),
        ...queryConfig,
    });
};
