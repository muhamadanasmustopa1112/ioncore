import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PlatformConfig, ConfigCategory } from "../types/platform-config";
import type { PlatformConfigDto, PlatformConfigUpdatePayload } from "../types/platform-config-api";
import {
  listPlatformConfigs,
  resetPlatformConfig,
  testConnection,
  updatePlatformConfig,
} from "./platform-config-api";

export const platformConfigKeys = {
  all: ["platform-config"] as const,
  byCategory: (category?: ConfigCategory) =>
    [...platformConfigKeys.all, "list", category ?? "all"] as const,
};

function mapToConfig(dto: PlatformConfigDto): PlatformConfig {
  return {
    key: dto.key,
    value: dto.value,
    configType: dto.config_type,
    branchId: dto.branch_id,
    category: dto.category,
    description: dto.description,
    required: dto.required,
    dataType: dto.data_type,
    allowedValues: dto.allowed_values,
    defaultValue: dto.default_value,
    isSensitive: dto.is_sensitive,
    updatedAt: dto.updated_at,
    updatedBy: dto.updated_by,
  };
}

export function usePlatformConfigList(category?: ConfigCategory) {
  return useQuery({
    queryKey: platformConfigKeys.byCategory(category),
    queryFn: async () => {
      const res = await listPlatformConfigs(category);
      return (res.data?.configs ?? []).map(mapToConfig);
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useUpdatePlatformConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ key, payload }: { key: string; payload: PlatformConfigUpdatePayload }) =>
      updatePlatformConfig(key, payload),
    onSuccess: () => {
      toast.success("Config updated");
      qc.invalidateQueries({ queryKey: platformConfigKeys.all });
    },
    onError: () => toast.error("Failed to update config"),
  });
}

export function useResetPlatformConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => resetPlatformConfig(key),
    onSuccess: () => {
      toast.success("Config reset to default");
      qc.invalidateQueries({ queryKey: platformConfigKeys.all });
    },
    onError: () => toast.error("Failed to reset config"),
  });
}

export function useTestConnection() {
  return useMutation({
    mutationFn: (key: string) => testConnection(key),
    onError: () => toast.error("Connection test failed"),
  });
}
