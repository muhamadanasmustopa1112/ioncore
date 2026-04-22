import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { ODP_KEYS } from "./key";
import { OdpResponse } from "../types/odp";

export const getOdps = (pop_id?: string): Promise<OdpResponse> => {
    const url = pop_id 
        ? `${services.networking}/odp-pop/view-map/odps?pop_id=${pop_id}`
        : `${services.networking}/odp-pop/view-map/odps`;
    return api.get(url);
};

export const getOdpsQueryOptions = (pop_id?: string) => {
    return queryOptions({
        queryKey: ODP_KEYS.list({ pop_id }),
        queryFn: () => getOdps(pop_id),
    });
};

type UseOdpsOptions = {
    pop_id?: string;
    queryConfig?: QueryConfig<typeof getOdpsQueryOptions>;
};

export const useOdps = ({ pop_id, queryConfig }: UseOdpsOptions = {}) => {
    return useQuery({
        ...getOdpsQueryOptions(pop_id),
        ...queryConfig,
    });
};

