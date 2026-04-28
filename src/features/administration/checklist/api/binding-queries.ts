import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChecklistBinding, ServiceChangePolicy } from "../types/binding";
import type {
  ChecklistBindingDto,
  ChecklistBindingPayload,
  ServiceChangePolicyDto,
  ServiceChangePolicyPayload,
} from "../types/binding-api";
import {
  createBinding,
  createServiceChangePolicy,
  deleteBinding,
  deleteServiceChangePolicy,
  listBindings,
  listServiceChangePolicies,
  updateBinding,
  updateServiceChangePolicy,
} from "./binding-api";

export const bindingKeys = {
  all: ["checklist-bindings"] as const,
  list: () => [...bindingKeys.all, "list"] as const,
  policies: () => [...bindingKeys.all, "policies"] as const,
};

function mapBinding(dto: ChecklistBindingDto): ChecklistBinding {
  return {
    id: dto.id,
    woType: dto.wo_type,
    maintenanceSubtype: dto.maintenance_subtype,
    productType: dto.product_type,
    templateId: dto.template_id,
    templateName: dto.template_name,
    templateVersion: dto.template_version,
    active: dto.active,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function mapPolicy(dto: ServiceChangePolicyDto): ServiceChangePolicy {
  return {
    id: dto.id,
    serviceChangeType: dto.service_change_type,
    fromPackageCode: dto.from_package_code,
    toPackageCode: dto.to_package_code,
    requiresChecklistType: dto.requires_checklist_type,
    notes: dto.notes,
    createdAt: dto.created_at,
  };
}

export function useBindingList() {
  return useQuery({
    queryKey: bindingKeys.list(),
    queryFn: async () => {
      const res = await listBindings();
      return (res.data?.bindings ?? []).map(mapBinding);
    },
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useServiceChangePolicies() {
  return useQuery({
    queryKey: bindingKeys.policies(),
    queryFn: async () => {
      const res = await listServiceChangePolicies();
      return (res.data?.policies ?? []).map(mapPolicy);
    },
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useCreateBinding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChecklistBindingPayload) => createBinding(payload),
    onSuccess: () => { toast.success("Binding created"); qc.invalidateQueries({ queryKey: bindingKeys.all }); },
    onError: () => toast.error("Failed to create binding"),
  });
}

export function useUpdateBinding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ChecklistBindingPayload> }) =>
      updateBinding(id, payload),
    onSuccess: () => { toast.success("Binding updated"); qc.invalidateQueries({ queryKey: bindingKeys.all }); },
    onError: () => toast.error("Failed to update binding"),
  });
}

export function useDeleteBinding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBinding(id),
    onSuccess: () => { toast.success("Binding deactivated"); qc.invalidateQueries({ queryKey: bindingKeys.all }); },
    onError: () => toast.error("Failed to deactivate binding"),
  });
}

export function useCreateServiceChangePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ServiceChangePolicyPayload) => createServiceChangePolicy(payload),
    onSuccess: () => { toast.success("Policy created"); qc.invalidateQueries({ queryKey: bindingKeys.policies() }); },
    onError: () => toast.error("Failed to create policy"),
  });
}

export function useDeleteServiceChangePolicy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteServiceChangePolicy(id),
    onSuccess: () => { toast.success("Policy deleted"); qc.invalidateQueries({ queryKey: bindingKeys.policies() }); },
    onError: () => toast.error("Failed to delete policy"),
  });
}
