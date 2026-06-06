import { queryOptions, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { userServiceApi } from "@/features/user-service/api/client";
import { services } from "@/config/constants";
import { WAREHOUSE_KEYS } from "./keys";
import type {
  InventoryMovementsFilterParams,
  InventoryMovementsListParams,
  InventoryMovementsListResponse,
} from "../types/inventory-movements";

const BASE = `${services.warehouse}`;

export const getInventoryMovements = async (
  params: InventoryMovementsListParams
): Promise<InventoryMovementsListResponse> => {
  return userServiceApi.get(
    `${BASE}/warehouse/reports/inventory-movements`,
    { params }
  );
};

export const getInventoryMovementsQueryOptions = (
  params: InventoryMovementsListParams
) => {
  return queryOptions({
    queryKey: WAREHOUSE_KEYS.inventoryMovements(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getInventoryMovements(params),
  });
};

type UseInventoryMovementsOptions = {
  params: InventoryMovementsListParams;
  queryConfig?: QueryConfig<typeof getInventoryMovementsQueryOptions>;
};

export const useInventoryMovements = ({
  params,
  queryConfig,
}: UseInventoryMovementsOptions) => {
  return useQuery({
    ...getInventoryMovementsQueryOptions(params),
    ...queryConfig,
  });
};

type UseInfiniteInventoryMovementsOptions = InventoryMovementsFilterParams & {
  limit: number;
  queryConfig?: { enabled?: boolean };
};

export const useInfiniteInventoryMovements = ({
  limit,
  warehouse_id,
  stock_item_id,
  asset_id,
  batch_id,
  category_id,
  movement_type,
  reference_id,
  queryConfig,
}: UseInfiniteInventoryMovementsOptions) => {
  return useInfiniteQuery({
    queryKey: WAREHOUSE_KEYS.inventoryMovements({
      limit,
      warehouse_id,
      stock_item_id,
      asset_id,
      batch_id,
      category_id,
      movement_type,
      reference_id,
      infinite: true,
    }),
    queryFn: ({ pageParam = 1 }) =>
      getInventoryMovements({
        page: pageParam,
        limit,
        warehouse_id,
        stock_item_id,
        asset_id,
        batch_id,
        category_id,
        movement_type,
        reference_id,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.metadata.current_page < lastPage.metadata.total_page
        ? lastPage.metadata.current_page + 1
        : undefined,
    initialPageParam: 1,
    ...queryConfig,
  });
};
