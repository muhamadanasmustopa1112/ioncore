import { api } from "@/lib/api-client";
import type {
  WorkOrderDto,
  WorkOrderListResponse,
  WorkOrderFilters,
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  AssignTechnicianPayload,
  UpdateStatusPayload,
  CreateChecklistPayload,
  UpdateChecklistItemPayload,
  ChecklistDto,
} from "../types/work-order-api";

const BASE = "/v1/order/work-orders";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  message: string;
  data: T | null;
  error: string;
  metadata: unknown;
}

export function listWorkOrders(filters?: WorkOrderFilters) {
  return cast<ApiResponse<WorkOrderListResponse>>(api.get(BASE, { params: filters }));
}

export function getWorkOrder(id: string) {
  return cast<ApiResponse<WorkOrderDto>>(api.get(`${BASE}/${id}`));
}

export function createWorkOrder(payload: CreateWorkOrderPayload) {
  return cast<ApiResponse<WorkOrderDto>>(api.post(BASE, payload));
}

export function updateWorkOrder(id: string, payload: UpdateWorkOrderPayload) {
  return cast<ApiResponse<WorkOrderDto>>(api.put(`${BASE}/${id}`, payload));
}

export function assignTechnician(id: string, payload: AssignTechnicianPayload) {
  return cast<ApiResponse<WorkOrderDto>>(api.patch(`${BASE}/${id}/assign`, payload));
}

export function updateWorkOrderStatus(id: string, payload: UpdateStatusPayload) {
  return cast<ApiResponse<WorkOrderDto>>(api.patch(`${BASE}/${id}/status`, payload));
}

export function createChecklist(workOrderId: string, payload: CreateChecklistPayload) {
  return cast<ApiResponse<ChecklistDto>>(api.post(`${BASE}/${workOrderId}/checklists`, payload));
}

export function updateChecklistItem(workOrderId: string, itemId: string, payload: UpdateChecklistItemPayload) {
  return cast<ApiResponse<null>>(api.patch(`${BASE}/${workOrderId}/checklists/items/${itemId}`, payload));
}
