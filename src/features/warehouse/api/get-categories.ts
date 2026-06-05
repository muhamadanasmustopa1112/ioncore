import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type { CategoriesListResponse } from "../types/categories";

const BASE = `${services.warehouse}`;

export const getCategories = async (): Promise<CategoriesListResponse> => {
  return userServiceApi.get(`${BASE}/warehouse/categories`);
};

export const getCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.categories(),
    queryFn: () => getCategories(),
  });
};

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

export const useCategories = ({
  queryConfig,
}: UseCategoriesOptions = {}) => {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  });
};
