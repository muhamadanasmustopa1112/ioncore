import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import type { WorkOrder, Checklist, ChecklistItem } from "../types/work-order";
import type {
  WorkOrderDto,
  ChecklistDto,
  ChecklistItemDto,
  WorkOrderFilters,
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  AssignTechnicianPayload,
  UpdateStatusPayload,
  CreateChecklistPayload,
  UpdateChecklistItemPayload,
} from "../types/work-order-api";
import {
  listWorkOrders,
  getWorkOrder,
  createWorkOrder,
  updateWorkOrder,
  assignTechnician,
  updateWorkOrderStatus,
  createChecklist,
  updateChecklistItem,
} from "./work-order-api";

export const workOrderKeys = {
  all: ["work-orders"] as const,
  list: (filters?: object) => [...workOrderKeys.all, "list", filters ?? {}] as const,
  detail: (id: string) => [...workOrderKeys.all, id] as const,
};

function mapChecklistItem(dto: ChecklistItemDto): ChecklistItem {
  return {
    id: dto.id,
    checklistId: dto.checklist_id,
    templateItemId: dto.template_item_id,
    itemName: dto.item_name,
    description: dto.description,
    orderNumber: dto.order_number,
    isRequired: dto.is_required,
    isChecked: dto.is_checked,
    notes: dto.notes,
    checkedAt: dto.checked_at,
    checkedBy: dto.checked_by,
  };
}

function mapChecklist(dto: ChecklistDto): Checklist {
  return {
    id: dto.id,
    workOrderId: dto.work_order_id,
    templateId: dto.template_id,
    name: dto.name,
    items: (dto.items ?? []).map(mapChecklistItem),
  };
}

function mapWorkOrder(dto: WorkOrderDto): WorkOrder {
  return {
    id: dto.id,
    woNumber: dto.wo_number,
    title: dto.title,
    description: dto.description,
    type: dto.type,
    status: dto.status,
    priority: dto.priority,
    customerId: dto.customer_id,
    customerName: dto.customer_name,
    serviceAddress: dto.service_address,
    branchId: dto.branch_id,
    technicianId: dto.technician_id,
    technicianName: dto.technician_name,
    notes: dto.notes,
    scheduledAt: dto.scheduled_at,
    startedAt: dto.started_at,
    completedAt: dto.completed_at,
    isActive: dto.is_active,
    createdAt: dto.created_at,
    createdBy: dto.created_by,
    updatedAt: dto.updated_at,
    updatedBy: dto.updated_by,
    checklists: (dto.checklists ?? []).map(mapChecklist),
  };
}

export function useWorkOrderList(filters?: WorkOrderFilters) {
  const { rawUser } = useAuthStore();

  const isLeader = rawUser?.roles?.some((r: any) => {
    const name = typeof r === "object" ? r.name : r;
    return name?.toUpperCase().includes("LEADER");
  });

  const finalFilters: WorkOrderFilters = {
    ...filters,
    branch_id: filters?.branch_id ?? (isLeader ? (rawUser?.active_branch_id ?? undefined) : undefined),
  };

  return useQuery({
    queryKey: workOrderKeys.list(finalFilters),
    queryFn: async () => {
      const res = await listWorkOrders(finalFilters);
      return {
        workOrders: (res.data?.work_orders ?? []).map(mapWorkOrder),
        total: res.data?.metadata.total ?? 0,
        page: res.data?.metadata.page ?? 1,
        perPage: res.data?.metadata.per_page ?? 10,
      };
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useWorkOrderDetail(id: string) {
  return useQuery({
    queryKey: workOrderKeys.detail(id),
    queryFn: async () => {
      const res = await getWorkOrder(id);
      if (!res.data) throw new Error("Not found");
      return mapWorkOrder(res.data);
    },
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useCreateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkOrderPayload) => createWorkOrder(payload),
    onSuccess: () => {
      toast.success("Work order created");
      qc.invalidateQueries({ queryKey: workOrderKeys.all });
    },
    onError: () => toast.error("Failed to create work order"),
  });
}

export function useUpdateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWorkOrderPayload }) =>
      updateWorkOrder(id, payload),
    onSuccess: (_, { id }) => {
      toast.success("Work order updated");
      qc.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: workOrderKeys.all });
    },
    onError: () => toast.error("Failed to update work order"),
  });
}

export function useAssignTechnician() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AssignTechnicianPayload }) =>
      assignTechnician(id, payload),
    onSuccess: (_, { id }) => {
      toast.success("Technician assigned");
      qc.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: workOrderKeys.all });
    },
    onError: () => toast.error("Failed to assign technician"),
  });
}

export function useUpdateWorkOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStatusPayload }) =>
      updateWorkOrderStatus(id, payload),
    onSuccess: (_, { id }) => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: workOrderKeys.detail(id) });
      qc.invalidateQueries({ queryKey: workOrderKeys.all });
    },
    onError: () => toast.error("Failed to update status"),
  });
}

export function useCreateChecklist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workOrderId, payload }: { workOrderId: string; payload: CreateChecklistPayload }) =>
      createChecklist(workOrderId, payload),
    onSuccess: (_, { workOrderId }) => {
      toast.success("Checklist added");
      qc.invalidateQueries({ queryKey: workOrderKeys.detail(workOrderId) });
    },
    onError: () => toast.error("Failed to add checklist"),
  });
}

export function useUpdateChecklistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      workOrderId,
      itemId,
      payload,
    }: {
      workOrderId: string;
      itemId: string;
      payload: UpdateChecklistItemPayload;
    }) => updateChecklistItem(workOrderId, itemId, payload),
    onSuccess: (_, { workOrderId }) => {
      qc.invalidateQueries({ queryKey: workOrderKeys.detail(workOrderId) });
    },
    onError: () => toast.error("Failed to update checklist item"),
  });
}
