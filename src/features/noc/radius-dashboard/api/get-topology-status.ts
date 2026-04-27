import { queryOptions, useQuery } from "@tanstack/react-query";
import { services } from "@/config/constants";
import { api } from "@/lib/api-client";
import { QueryConfig } from "@/lib/react-query";
import { RADIUS_DASHBOARD_KEYS } from "./key";
import { NocTopologyStatus } from "../types/radius-dashboard";

export const getNocTopologyStatus = (): Promise<NocTopologyStatus> => {
  return api.get(`${services.networking}/monitoring/dashboard/topology-status`);
};

export const getNocTopologyStatusQueryOptions = () => {
  return queryOptions({
    queryKey: RADIUS_DASHBOARD_KEYS.topologyStatus(),
    queryFn: () => getNocTopologyStatus(),
  });
};

type UseNocTopologyStatusOptions = {
  queryConfig?: QueryConfig<typeof getNocTopologyStatusQueryOptions>;
};

export const useNocTopologyStatus = ({ queryConfig }: UseNocTopologyStatusOptions = {}) => {
  return useQuery({
    ...getNocTopologyStatusQueryOptions(),
    ...queryConfig,
  });
};
