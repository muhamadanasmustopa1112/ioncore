import { queryOptions, useQuery } from "@tanstack/react-query";

import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { OLT_KEYS } from "./key";
import { OltData, OltParams, OltResponse } from "../types/olt";

export const getOlt = (params: OltParams): Promise<OltResponse> => {
    return api.get(`${services.networking}/monitoring/topology/olts`, { params });
};

export const getOltById = (id: string): Promise<OltData> => {
    return api.get(`${services.networking}/monitoring/topology/olts/${id}`);
};

export const getOltQueryOptions = (params: OltParams) => {
    return queryOptions({
        queryKey: OLT_KEYS.list(params),
        queryFn: () => getOlt(params),
    });
};

export const getOltByIdQueryOptions = (id: string) => {
    return queryOptions({
        queryKey: OLT_KEYS.detail(id),
        queryFn: () => getOltById(id),
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

type UseOltByIdOptions = {
    id: string;
    queryConfig?: QueryConfig<typeof getOltByIdQueryOptions>;
};

export const useOltById = ({ id, queryConfig }: UseOltByIdOptions) => {
    return useQuery({
        ...getOltByIdQueryOptions(id),
        ...queryConfig,
    });
};
