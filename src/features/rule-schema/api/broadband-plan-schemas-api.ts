import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiError } from "@/lib/helpers";
import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import { ruleSchemaKeys } from "./keys";
import type { RuleSchemaEnvelope } from "../types";
import type {
  BroadbandPlanSchema,
  BroadbandPlanSchemaListData,
  BroadbandPlanSchemaListParams,
  CreateBroadbandPlanSchemaPayload,
  UpdateBroadbandPlanSchemaPayload,
} from "../types/broadband-plan-schemas";

const base = services.ruleScheme;

// ── API functions ───────────────────────────────────────

export const listBroadbandPlanSchemas = (params?: BroadbandPlanSchemaListParams) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<BroadbandPlanSchemaListData>>(
    `${base}/broadband-plan-schemas/`,
    { params },
  );

export const getBroadbandPlanSchema = (id: string) =>
  userServiceApi.get<unknown, RuleSchemaEnvelope<BroadbandPlanSchema>>(
    `${base}/broadband-plan-schemas/${id}`,
  );

export const createBroadbandPlanSchema = (payload: CreateBroadbandPlanSchemaPayload) =>
  userServiceApi.post<unknown, RuleSchemaEnvelope<BroadbandPlanSchema>>(
    `${base}/broadband-plan-schemas/`,
    payload,
  );

export const updateBroadbandPlanSchema = (id: string, payload: UpdateBroadbandPlanSchemaPayload) =>
  userServiceApi.put<unknown, RuleSchemaEnvelope<BroadbandPlanSchema>>(
    `${base}/broadband-plan-schemas/${id}`,
    payload,
  );

export const deleteBroadbandPlanSchema = (id: string) =>
  userServiceApi.delete<unknown, RuleSchemaEnvelope<null>>(
    `${base}/broadband-plan-schemas/${id}`,
  );

// ── Safe placeholders ───────────────────────────────────

const EMPTY_META = { page: 1, size: 10, total: 0 };

const EMPTY_LIST: RuleSchemaEnvelope<BroadbandPlanSchemaListData> = {
  data: { broadband_plan_schemas: [], metadata: EMPTY_META },
  error: "",
  message: "",
  metadata: null,
};

// ── Hooks ───────────────────────────────────────────────

export const useBroadbandPlanSchemas = (params?: BroadbandPlanSchemaListParams) =>
  useQuery({
    queryKey: ruleSchemaKeys.broadbandPlanSchemas(params),
    queryFn: async () => {
      try { return await listBroadbandPlanSchemas(params); } catch { return EMPTY_LIST; }
    },
    placeholderData: EMPTY_LIST,
    retry: false,
  });

export const useBroadbandPlanSchema = (id: string) =>
  useQuery({
    queryKey: ruleSchemaKeys.broadbandPlanSchema(id),
    queryFn: async () => {
      try { return await getBroadbandPlanSchema(id); } catch { return null; }
    },
    enabled: !!id,
    retry: false,
  });

const BP_SCHEMAS_PREFIX = [...ruleSchemaKeys.all, "broadband-plan-schemas"] as const;

export const useCreateBroadbandPlanSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBroadbandPlanSchemaPayload) =>
      createBroadbandPlanSchema(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BP_SCHEMAS_PREFIX });
      toast.success("Schema assigned to plan.", { id: "schema-assigned" });
    },
    onError: (err) => toast.error(getApiError(err, "Failed to assign schema.")),
  });
};

export const useUpdateBroadbandPlanSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBroadbandPlanSchemaPayload }) =>
      updateBroadbandPlanSchema(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ruleSchemaKeys.broadbandPlanSchema(id) });
      qc.invalidateQueries({ queryKey: BP_SCHEMAS_PREFIX });
      toast.success("Schema updated.");
    },
    onError: (err) => toast.error(getApiError(err, "Failed to update schema.")),
  });
};

export const useDeleteBroadbandPlanSchema = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBroadbandPlanSchema(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BP_SCHEMAS_PREFIX });
      toast.success("Schema removed from plan.");
    },
    onError: (err) => toast.error(getApiError(err, "Failed to remove schema.")),
  });
};
