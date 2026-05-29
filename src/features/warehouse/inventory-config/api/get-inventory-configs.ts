import { queryOptions, useQuery } from "@tanstack/react-query";
import { INVENTORY_CONFIG_KEYS } from "./keys";
import { DUMMY_INVENTORY_CONFIG } from "../data/dummy-inventory-config";
import type { InventoryValuationConfig } from "../types";

type InventoryConfigParams = {
  draw: number;
  start: number;
  length: number;
  search?: string;
};

type InventoryConfigResponse = {
  data: InventoryValuationConfig[];
  metadata?: {
    total_data: number;
    total_page: number;
  };
};

const getInventoryConfigs = async (params: InventoryConfigParams): Promise<InventoryConfigResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredData = DUMMY_INVENTORY_CONFIG;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredData = filteredData.filter((config) =>
      config.warehouseName.toLowerCase().includes(searchLower)
    );
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

export const getInventoryConfigsQueryOptions = (params: InventoryConfigParams) => {
  return queryOptions({
    queryKey: INVENTORY_CONFIG_KEYS.list(params),
    queryFn: () => getInventoryConfigs(params),
    staleTime: 5 * 60 * 1000,
  });
};

type UseInventoryConfigsOptions = {
  params: InventoryConfigParams;
  queryConfig?: Record<string, unknown>;
};

export const useInventoryConfigs = ({ params, queryConfig }: UseInventoryConfigsOptions) => {
  return useQuery({
    ...getInventoryConfigsQueryOptions(params),
    ...queryConfig,
  });
};
