import { queryOptions, useQuery } from "@tanstack/react-query";
import { CSAT_KEYS } from "./keys";
import { DUMMY_CSAT_SUMMARY } from "../../data/dummy-tickets";
import type { CsatSummary } from "../../types";

const getCsatSummary = async (): Promise<CsatSummary> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DUMMY_CSAT_SUMMARY;
};

export const getCsatSummaryQueryOptions = () => {
  return queryOptions({
    queryKey: CSAT_KEYS.summary(),
    queryFn: getCsatSummary,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCsatSummary = () => {
  return useQuery(getCsatSummaryQueryOptions());
};
