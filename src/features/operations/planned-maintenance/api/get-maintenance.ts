import { queryOptions, useQuery } from "@tanstack/react-query";
import { MAINTENANCE_KEYS } from "./keys";
import { DUMMY_MAINTENANCE_EVENTS } from "../data/dummy-maintenance";
import type { MaintenanceEvent } from "../types";

type MaintenanceParams = {
  draw: number;
  start: number;
  length: number;
  search?: string;
  status?: string;
  maintenance_type?: string;
};

type MaintenanceResponse = {
  data: MaintenanceEvent[];
  metadata?: {
    total_data: number;
    total_page: number;
  };
};

const getMaintenanceEvents = async (params: MaintenanceParams): Promise<MaintenanceResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredData = DUMMY_MAINTENANCE_EVENTS;

  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredData = filteredData.filter((event) =>
      event.title.toLowerCase().includes(searchLower)
    );
  }

  if (params.status) {
    filteredData = filteredData.filter((event) => event.status === params.status);
  }

  if (params.maintenance_type) {
    filteredData = filteredData.filter((event) => event.maintenance_type === params.maintenance_type);
  }

  const start = params.start || 0;
  const length = params.length || 10;
  const paginatedData = filteredData.slice(start, start + length);

  return {
    data: paginatedData,
    metadata: {
      total_data: filteredData.length,
      total_page: Math.ceil(filteredData.length / length),
    },
  };
};

export const getMaintenanceQueryOptions = (params: MaintenanceParams) => {
  return queryOptions({
    queryKey: MAINTENANCE_KEYS.list(params),
    queryFn: () => getMaintenanceEvents(params),
    staleTime: 5 * 60 * 1000,
  });
};

type UseMaintenanceOptions = {
  params: MaintenanceParams;
  queryConfig?: Record<string, unknown>;
};

export const useMaintenance = ({ params, queryConfig }: UseMaintenanceOptions) => {
  return useQuery({
    ...getMaintenanceQueryOptions(params),
    ...queryConfig,
  });
};
