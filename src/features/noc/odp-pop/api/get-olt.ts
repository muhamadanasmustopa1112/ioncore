import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { OLT_KEYS } from "./key";
import { OltParams, OltResponse } from "../types/olt";

export const getOlt = (params: OltParams): Promise<OltResponse> => {
    return api.get(`${services.networking}/monitoring/topology/olts`, { params });
};

export const getOltQueryOptions = (params: OltParams) => {
    return queryOptions({
        queryKey: OLT_KEYS.list(params),
        queryFn: () => getOlt(params),
    });
};

type UseOltOptions = {
    params: OltParams;
    queryConfig?: QueryConfig<typeof getOltQueryOptions>;
};

export const useOlt = ({ params, queryConfig }: UseOltOptions) => {
    return useQuery({
        ...getOltQueryOptions(params),
        ...queryConfig,
    });
};
