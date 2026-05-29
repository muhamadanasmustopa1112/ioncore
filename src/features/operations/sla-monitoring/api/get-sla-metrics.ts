import { queryOptions, useQuery } from "@tanstack/react-query";

import { QueryConfig } from "@/lib/react-query";

import { dummySlaDashboard } from "../data/dummy-sla-metrics";
import type { SlaDashboardResponse } from "../types";

import { SLA_KEYS } from "./keys";

type SlaDashboardParams = {
  area_id?: string | null;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSlaDashboard = async (
  params: SlaDashboardParams
): Promise<SlaDashboardResponse> => {
  await delay(300);

  if (params.area_id) {
    const filtered: SlaDashboardResponse = {
      ...dummySlaDashboard,
      metrics: { ...dummySlaDashboard.metrics },
    };

    for (const key of Object.keys(filtered.metrics) as Array<
      keyof typeof filtered.metrics
    >) {
      const metric = filtered.metrics[key];
      filtered.metrics[key] = {
        ...metric,
        drilldown_records: metric.drilldown_records.filter(
          (r) => r.area === params.area_id
        ),
      };
    }

    return filtered;
  }

  return dummySlaDashboard;
};

export const getSlaDashboardQueryOptions = (params: SlaDashboardParams) => {
  return queryOptions({
    queryKey: SLA_KEYS.dashboard(),
    queryFn: () => getSlaDashboard(params),
  });
};

type UseSlaDashboardOptions = {
  params: SlaDashboardParams;
  queryConfig?: QueryConfig<typeof getSlaDashboardQueryOptions>;
};

export const useSlaDashboard = ({
  params,
  queryConfig,
}: UseSlaDashboardOptions) => {
  return useQuery({
    ...getSlaDashboardQueryOptions(params),
    ...queryConfig,
  });
};
