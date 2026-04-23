import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";

import { ODP_KEYS } from "./key";
import { OdpResponse, OdpParams } from "../types/odp";

export const getOdps = (params: OdpParams): Promise<OdpResponse> => {
    return api.get(`${services.networking}/odp-pop/odps`, { params });
};

export const getOdpsQueryOptions = (params: OdpParams) => {
    return queryOptions({
        queryKey: ODP_KEYS.list(params),
        queryFn: () => getOdps(params),
    });
};

type UseOdpOptions = {
    params: OdpParams;
    queryConfig?: QueryConfig<typeof getOdpsQueryOptions>;
};

export const useOdp = ({ params, queryConfig }: UseOdpOptions) => {
    return useQuery({
        ...getOdpsQueryOptions(params),
        ...queryConfig,
    });
};
