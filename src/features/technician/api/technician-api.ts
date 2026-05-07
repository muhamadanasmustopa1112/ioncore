import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  // Lists / detail
  WorkOrderDashboardEnvelope,
  WorkOrderDetailEnvelope,
  WorkOrderListParams,
  WorkOrderTimelineEnvelope,
  // CRUD
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  CancelWorkOrderPayload,
  // Technician actions
  AcceptWorkOrderPayload,
  JourneyEventPayload,
  UpsertProofOfWorkPayload,
  UpsertResolutionLogPayload,
  IssueReportPayload,
  CustomerSignOffRequestPayload,
  CustomerSignOffConfirmPayload,
  SubmitBASTPayload,
  // Team-leader
  TeamLeaderDashboardEnvelope,
  TeamLeaderDashboardParams,
  AutoAssignWorkOrdersPayload,
  AutoAssignWorkOrdersResponse,
  UpsertPairingPayload,
  PairingRecommendationPayload,
  PairingRecommendationResponse,
  // NOC
  NOCQueueEnvelope,
  NOCQueueParams,
  ProcessNOCApprovalPayload,
  NOCApproval,
  NOCApprovalLogEntry,
  // Warehouse
  WorkOrderInventoryRequirementsResponse,
  WorkOrderInventoryVerification,
  VerifyInventoryPayload,
  DeviceReceiptPayload,
  WarehouseDispatchPayload,
  WarehouseDispatch,
  RequestTemporaryRadiusPayload,
  // Cross-area
  CreateCrossAreaPayload,
  ReviewCrossAreaPayload,
  CrossAreaRequest,
  // Analytics & history
  RepeatIssueDetectionResponse,
  DispatchMapResponse,
  TechnicianPerformanceResponse,
  TechnicianWorkOrderHistoryResponse,
  WorkOrderHistoryResponse,
  ResponseEnvelope,
  WorkOrderDetailResponse,
  ListTechniciansParams,
  ListTechniciansResponse,
} from "../types/technician-api";

const BASE = services.technical;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

// ── Work orders: list / detail / timeline ──────────────────────────────────

export function listWorkOrders(params: WorkOrderListParams = {}) {
  return cast<WorkOrderDashboardEnvelope>(
    userServiceApi.get(`${BASE}/work-orders`, {
      params: {
        page: params.page ?? 1,
        per_page: params.per_page ?? 15,
        ...(params.type && { type: params.type }),
        ...(params.state && { state: params.state }),
        ...(params.priority && { priority: params.priority }),
        ...(params.area_id && { area_id: params.area_id }),
        ...(params.sub_area_id && { sub_area_id: params.sub_area_id }),
        ...(params.queue_owner_id && { queue_owner_id: params.queue_owner_id }),
        ...(params.technician_id && { technician_id: params.technician_id }),
      },
    })
  );
}

export function getWorkOrder(id: string) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.get(`${BASE}/work-orders/${id}`)
  );
}

export function getWorkOrderTimeline(id: string) {
  return cast<WorkOrderTimelineEnvelope>(
    userServiceApi.get(`${BASE}/work-orders/${id}/timeline`)
  );
}

// ── Work orders: create / update / cancel ──────────────────────────────────

export function createWorkOrder(payload: CreateWorkOrderPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders`, payload)
  );
}

export function updateWorkOrder(id: string, payload: UpdateWorkOrderPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.patch(`${BASE}/work-orders/${id}`, payload)
  );
}

export function cancelWorkOrder(id: string, payload: CancelWorkOrderPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/cancel`, payload)
  );
}

// ── Technician actions ─────────────────────────────────────────────────────

export function acceptWorkOrder(id: string, payload: AcceptWorkOrderPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/accept`, payload)
  );
}

export function startJourney(id: string, payload: JourneyEventPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/journey/start`, payload)
  );
}

export function recordArrival(id: string, payload: JourneyEventPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/arrival`, payload)
  );
}

export function upsertProofOfWork(id: string, payload: UpsertProofOfWorkPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/proof-of-work`, payload)
  );
}

export function upsertResolutionLog(id: string, payload: UpsertResolutionLogPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/resolution-log`, payload)
  );
}

export function reportIssue(id: string, payload: IssueReportPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/issue-report`, payload)
  );
}

export function requestCustomerSignOff(id: string, payload: CustomerSignOffRequestPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/customer-sign-off/request`, payload)
  );
}

export function confirmCustomerSignOff(id: string, payload: CustomerSignOffConfirmPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/customer-sign-off/confirm`, payload)
  );
}

export function submitBAST(id: string, payload: SubmitBASTPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/bast/submit`, payload)
  );
}

// ── Team-leader ────────────────────────────────────────────────────────────

export function getTeamLeaderDashboard(params: TeamLeaderDashboardParams = {}) {
  return cast<TeamLeaderDashboardEnvelope>(
    userServiceApi.get(`${BASE}/team-leader/dashboard`, { params })
  );
}

export function autoAssignWorkOrders(payload: AutoAssignWorkOrdersPayload) {
  return cast<ResponseEnvelope<AutoAssignWorkOrdersResponse>>(
    userServiceApi.post(`${BASE}/work-orders/auto-assign`, payload)
  );
}

export function assignPairing(id: string, payload: UpsertPairingPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/pairing`, payload)
  );
}

export function updatePairing(id: string, payload: UpsertPairingPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.patch(`${BASE}/work-orders/${id}/pairing`, payload)
  );
}

export function getPairingRecommendation(id: string, payload: PairingRecommendationPayload) {
  return cast<ResponseEnvelope<PairingRecommendationResponse>>(
    userServiceApi.post(`${BASE}/work-orders/${id}/pairing/recommendation`, payload)
  );
}

// ── NOC ────────────────────────────────────────────────────────────────────

export function listNOCQueue(params: NOCQueueParams = {}) {
  return cast<NOCQueueEnvelope>(
    userServiceApi.get(`${BASE}/work-orders/noc-queue`, {
      params: {
        ...(params.type && { type: params.type }),
        ...(params.branch_id && { branch_id: params.branch_id }),
      },
    })
  );
}

export function processNOCApproval(id: string, payload: ProcessNOCApprovalPayload) {
  return cast<ResponseEnvelope<NOCApproval>>(
    userServiceApi.post(`${BASE}/work-orders/${id}/noc-approval`, payload)
  );
}

export function getNOCApprovalLog(id: string) {
  return cast<ResponseEnvelope<{ items: NOCApprovalLogEntry[] }>>(
    userServiceApi.get(`${BASE}/work-orders/${id}/noc-approval-log`)
  );
}

// ── Warehouse ──────────────────────────────────────────────────────────────

export function getInventoryRequirements(id: string) {
  return cast<ResponseEnvelope<WorkOrderInventoryRequirementsResponse>>(
    userServiceApi.get(`${BASE}/work-orders/${id}/inventory-requirements`)
  );
}

export function verifyInventory(id: string, payload: VerifyInventoryPayload) {
  return cast<ResponseEnvelope<WorkOrderInventoryVerification>>(
    userServiceApi.post(`${BASE}/work-orders/${id}/inventory-verifications`, payload)
  );
}

export function confirmDeviceReceipt(id: string, payload: DeviceReceiptPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/device-receipt/confirm`, payload)
  );
}

export function warehouseDispatch(id: string, payload: WarehouseDispatchPayload) {
  return cast<ResponseEnvelope<WarehouseDispatch>>(
    userServiceApi.post(`${BASE}/work-orders/${id}/warehouse-dispatch`, payload)
  );
}

// ── Cross-area ─────────────────────────────────────────────────────────────

export function createCrossAreaRequest(workOrderId: string, payload: CreateCrossAreaPayload) {
  return cast<ResponseEnvelope<CrossAreaRequest>>(
    userServiceApi.post(`${BASE}/work-orders/${workOrderId}/cross-area-requests`, payload)
  );
}

export function approveCrossAreaRequest(id: string, payload: ReviewCrossAreaPayload) {
  return cast<ResponseEnvelope<CrossAreaRequest>>(
    userServiceApi.post(`${BASE}/cross-area-requests/${id}/approve`, payload)
  );
}

export function rejectCrossAreaRequest(id: string, payload: ReviewCrossAreaPayload) {
  return cast<ResponseEnvelope<CrossAreaRequest>>(
    userServiceApi.post(`${BASE}/cross-area-requests/${id}/reject`, payload)
  );
}

// ── Analytics & history ────────────────────────────────────────────────────

export function getRepeatIssues(params: { branch_id?: string; period_days?: number } = {}) {
  return cast<ResponseEnvelope<RepeatIssueDetectionResponse>>(
    userServiceApi.get(`${BASE}/analytics/repeat-issues`, { params })
  );
}

export function getDispatchMap(
  params: { branch_id?: string; area_id?: string; technician_id?: string } = {}
) {
  return cast<ResponseEnvelope<DispatchMapResponse>>(
    userServiceApi.get(`${BASE}/dispatch/map`, { params })
  );
}

export function getTechnicianPerformance(
  params: { branch_id?: string; period_days?: number } = {}
) {
  return cast<ResponseEnvelope<TechnicianPerformanceResponse>>(
    userServiceApi.get(`${BASE}/technicians/performance`, { params })
  );
}

export function getTechnicianWorkOrderHistory(
  technicianId: string,
  params: { branch_id?: string; period_days?: number } = {}
) {
  return cast<ResponseEnvelope<TechnicianWorkOrderHistoryResponse>>(
    userServiceApi.get(`${BASE}/technicians/${technicianId}/work-order-history`, { params })
  );
}

export function getCustomerWorkOrderHistory(customerId: string) {
  return cast<ResponseEnvelope<WorkOrderHistoryResponse>>(
    userServiceApi.get(`${BASE}/customers/${customerId}/work-order-history`)
  );
}

export function getSiteWorkOrderHistory(siteId: string) {
  return cast<ResponseEnvelope<WorkOrderHistoryResponse>>(
    userServiceApi.get(`${BASE}/sites/${siteId}/work-order-history`)
  );
}

export function requestTemporaryRadius(id: string, payload: RequestTemporaryRadiusPayload) {
  return cast<WorkOrderDetailEnvelope>(
    userServiceApi.post(`${BASE}/work-orders/${id}/radius-provisionings/temporary`, payload)
  );
}

export function listTechnicians(payload: ListTechniciansParams = {}) {
  const body: Record<string, string> = {};
  if (payload.branch_id) body.branch_id = payload.branch_id;
  if (payload.team_leader_id) body.team_leader_id = payload.team_leader_id;

  return cast<ResponseEnvelope<ListTechniciansResponse>>(
    userServiceApi.post(`${BASE}/technicians/list`, body)
  );
}

// ── Re-export for callers needing the underlying detail type ───────────────

export type { WorkOrderDetailResponse };

