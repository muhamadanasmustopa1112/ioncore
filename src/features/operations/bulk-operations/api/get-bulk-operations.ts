import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/lib/react-query";
import { BulkOperationListResponse, BulkOperationParams } from "../types";
import { DUMMY_BULK_OPERATIONS } from "../data/dummy-bulk-operations";
import { BULK_OPERATION_KEYS } from "./keys";

const simulateDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getBulkOperations = async (
  params: BulkOperationParams,
): Promise<BulkOperationListResponse> => {
  await simulateDelay(300);

  let filtered = [...DUMMY_BULK_OPERATIONS];

  if (params.status) {
    filtered = filtered.filter((op) => op.status === params.status);
  }

  if (params.op_type) {
    filtered = filtered.filter((op) => op.op_type === params.op_type);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (op) =>
        op.id.toLowerCase().includes(q) ||
        op.description.toLowerCase().includes(q) ||
        op.scope.toLowerCase().includes(q),
    );
  }

  const limit = params.length ?? 10;
  const page = Math.floor((params.start ?? 0) / limit) + 1;
  const paged = filtered.slice(params.start ?? 0, (params.start ?? 0) + limit);

  return {
    data: paged,
    metadata: {
      total_data: filtered.length,
      total_page: Math.ceil(filtered.length / limit),
    },
  };
};

export const getBulkOperationsQueryOptions = (
  params: BulkOperationParams,
) =>
  queryOptions({
    queryKey: BULK_OPERATION_KEYS.list(params),
    queryFn: () => getBulkOperations(params),
  });

type UseBulkOperationsOptions = {
  params: BulkOperationParams;
  queryConfig?: QueryConfig<typeof getBulkOperationsQueryOptions>;
};

export const useBulkOperations = ({
  params,
  queryConfig,
}: UseBulkOperationsOptions) =>
  useQuery({
    ...getBulkOperationsQueryOptions(params),
    ...queryConfig,
  });
