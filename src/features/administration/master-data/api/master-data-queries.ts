import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NetworkNodeType, MaintenanceNoticeConfig, SeedDeployment } from "../types/master-data";
import type { NetworkNodeTypeDto, MaintenanceNoticeConfigDto, SeedDeploymentDto, NetworkNodeTypePayload } from "../types/master-data-api";
import {
  createNodeType,
  deleteNodeType,
  deploySeed,
  listMaintenanceConfig,
  listNodeTypes,
  listSeedDeployments,
  updateMaintenanceConfig,
  updateNodeType,
} from "./master-data-api";

export const masterDataKeys = {
  all: ["master-data"] as const,
  nodeTypes: () => [...masterDataKeys.all, "node-types"] as const,
  maintenanceConfig: () => [...masterDataKeys.all, "maintenance-config"] as const,
  seedDeployments: () => [...masterDataKeys.all, "seed-deployments"] as const,
};

function mapNodeType(dto: NetworkNodeTypeDto): NetworkNodeType {
  return {
    id: dto.id,
    typeKey: dto.type_key,
    label: dto.label,
    description: dto.description,
    iconOnline: dto.icon_online,
    iconOffline: dto.icon_offline,
    iconTrouble: dto.icon_trouble,
    sortOrder: dto.sort_order,
    source: dto.source,
    active: dto.active,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function mapMaintenanceConfig(dto: MaintenanceNoticeConfigDto): MaintenanceNoticeConfig {
  return {
    customerType: dto.customer_type,
    defaultNoticeLeadHours: dto.default_notice_lead_hours,
    updatedAt: dto.updated_at,
    updatedBy: dto.updated_by,
  };
}

function mapSeedDeployment(dto: SeedDeploymentDto): SeedDeployment {
  return {
    id: dto.id,
    seedName: dto.seed_name,
    seedVersion: dto.seed_version,
    deployedAt: dto.deployed_at,
    deployedBy: dto.deployed_by,
    status: dto.status,
  };
}

export function useNodeTypeList() {
  return useQuery({
    queryKey: masterDataKeys.nodeTypes(),
    queryFn: async () => {
      const res = await listNodeTypes();
      return (res.data?.node_types ?? []).map(mapNodeType);
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useMaintenanceConfigList() {
  return useQuery({
    queryKey: masterDataKeys.maintenanceConfig(),
    queryFn: async () => {
      const res = await listMaintenanceConfig();
      return (res.data?.configs ?? []).map(mapMaintenanceConfig);
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useSeedDeploymentList() {
  return useQuery({
    queryKey: masterDataKeys.seedDeployments(),
    queryFn: async () => {
      const res = await listSeedDeployments();
      return (res.data?.deployments ?? []).map(mapSeedDeployment);
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useCreateNodeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: NetworkNodeTypePayload) => createNodeType(payload),
    onSuccess: () => {
      toast.success("Node type created");
      qc.invalidateQueries({ queryKey: masterDataKeys.nodeTypes() });
    },
    onError: () => toast.error("Failed to create node type"),
  });
}

export function useUpdateNodeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NetworkNodeTypePayload> }) =>
      updateNodeType(id, payload),
    onSuccess: () => {
      toast.success("Node type updated");
      qc.invalidateQueries({ queryKey: masterDataKeys.nodeTypes() });
    },
    onError: () => toast.error("Failed to update node type"),
  });
}

export function useDeleteNodeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNodeType(id),
    onSuccess: () => {
      toast.success("Node type deactivated");
      qc.invalidateQueries({ queryKey: masterDataKeys.nodeTypes() });
    },
    onError: () => toast.error("Failed to deactivate node type"),
  });
}

export function useUpdateMaintenanceConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ customerType, hours }: { customerType: string; hours: number }) =>
      updateMaintenanceConfig(customerType, hours),
    onSuccess: () => {
      toast.success("Maintenance notice config updated");
      qc.invalidateQueries({ queryKey: masterDataKeys.maintenanceConfig() });
    },
    onError: () => toast.error("Failed to update maintenance config"),
  });
}

export function useDeploySeed() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (seedName: string) => deploySeed(seedName),
    onSuccess: () => {
      toast.success("Seed deployed successfully");
      qc.invalidateQueries({ queryKey: masterDataKeys.all });
    },
    onError: () => toast.error("Seed deployment failed"),
  });
}
