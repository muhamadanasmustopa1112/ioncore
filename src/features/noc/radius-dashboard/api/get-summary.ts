import { queryOptions, useQuery } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { RADIUS_DASHBOARD_KEYS } from "./key";
import { NocSummary } from "../types/radius-dashboard";

export const getNocSummary = (): Promise<NocSummary> => {
  return api.get(`${services.networking}/monitoring/dashboard/summary`);
};

export const getNocSummaryQueryOptions = () => {
  return queryOptions({
    queryKey: RADIUS_DASHBOARD_KEYS.summary(),
    queryFn: () => getNocSummary(),
  });
};

type UseNocSummaryOptions = {
  queryConfig?: QueryConfig<typeof getNocSummaryQueryOptions>;
};

export const useNocSummary = ({ queryConfig }: UseNocSummaryOptions = {}) => {
  return useQuery({
    ...getNocSummaryQueryOptions(),
    ...queryConfig,
  });
};
