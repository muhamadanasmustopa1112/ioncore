import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  // list / detail / timeline
  listWorkOrders,
  getWorkOrder,
  getWorkOrderTimeline,
  // CRUD
  createWorkOrder,
  updateWorkOrder,
  cancelWorkOrder,
  // Technician actions
  acceptWorkOrder,
  startJourney,
  recordArrival,
  upsertProofOfWork,
  upsertResolutionLog,
  reportIssue,
  requestCustomerSignOff,
  confirmCustomerSignOff,
  submitBAST,
  // Team-leader
  getTeamLeaderDashboard,
  autoAssignWorkOrders,
  assignPairing,
  updatePairing,
  getPairingRecommendation,
  // NOC
  listNOCQueue,
  processNOCApproval,
  getNOCApprovalLog,
  // Warehouse
  getInventoryRequirements,
  verifyInventory,
  confirmDeviceReceipt,
  warehouseDispatch,
  // Cross-area
  createCrossAreaRequest,
  approveCrossAreaRequest,
  rejectCrossAreaRequest,
  // Analytics & history
  getRepeatIssues,
  getDispatchMap,
  getTechnicianPerformance,
  getTechnicianWorkOrderHistory,
  getCustomerWorkOrderHistory,
  getSiteWorkOrderHistory,
} from "./technician-api";
import type {
  WorkOrderListParams,
  TeamLeaderDashboardParams,
  NOCQueueParams,
  CreateWorkOrderPayload,
  UpdateWorkOrderPayload,
  CancelWorkOrderPayload,
  AcceptWorkOrderPayload,
  JourneyEventPayload,
  UpsertProofOfWorkPayload,
  UpsertResolutionLogPayload,
  IssueReportPayload,
  CustomerSignOffRequestPayload,
  CustomerSignOffConfirmPayload,
  SubmitBASTPayload,
  AutoAssignWorkOrdersPayload,
  UpsertPairingPayload,
  PairingRecommendationPayload,
  ProcessNOCApprovalPayload,
  VerifyInventoryPayload,
  DeviceReceiptPayload,
  WarehouseDispatchPayload,
  CreateCrossAreaPayload,
  ReviewCrossAreaPayload,
} from "../types/technician-api";

// ── Query keys ─────────────────────────────────────────────────────────────

export const technicianKeys = {
  all: ["technician"] as const,
  workOrders: (params: WorkOrderListParams) =>
    [...technicianKeys.all, "work-orders", params] as const,
  workOrder: (id: string) =>
    [...technicianKeys.all, "work-order", id] as const,
  workOrderTimeline: (id: string) =>
    [...technicianKeys.all, "work-order", id, "timeline"] as const,
  teamLeaderDashboard: (params: TeamLeaderDashboardParams) =>
    [...technicianKeys.all, "team-leader-dashboard", params] as const,
  nocQueue: (params: NOCQueueParams) =>
    [...technicianKeys.all, "noc-queue", params] as const,
  nocApprovalLog: (id: string) =>
    [...technicianKeys.all, "work-order", id, "noc-approval-log"] as const,
  inventoryRequirements: (id: string) =>
    [...technicianKeys.all, "work-order", id, "inventory-requirements"] as const,
  repeatIssues: (params: { branch_id?: string; period_days?: number }) =>
    [...technicianKeys.all, "repeat-issues", params] as const,
  dispatchMap: (params: { branch_id?: string; area_id?: string; technician_id?: string }) =>
    [...technicianKeys.all, "dispatch-map", params] as const,
  technicianPerformance: (params: { branch_id?: string; period_days?: number }) =>
    [...technicianKeys.all, "technician-performance", params] as const,
  technicianHistory: (id: string, params: { branch_id?: string; period_days?: number }) =>
    [...technicianKeys.all, "technician", id, "history", params] as const,
  customerHistory: (id: string) =>
    [...technicianKeys.all, "customer", id, "history"] as const,
  siteHistory: (id: string) =>
    [...technicianKeys.all, "site", id, "history"] as const,
};

// ── Lists / detail ─────────────────────────────────────────────────────────

export function useWorkOrderList(params: WorkOrderListParams = {}) {
  return useQuery({
    queryKey: technicianKeys.workOrders(params),
    queryFn: async () => {
      const res = await listWorkOrders(params);
      return {
        items: res.data?.items ?? [],
        summary: res.data?.summary ?? { total: 0, by_state: {} as never, by_type: {} as never },
        metadata: res.metadata,
      };
    },
    placeholderData: {
      items: [],
      summary: { total: 0, by_state: {} as never, by_type: {} as never },
      metadata: { count: 0, page: 1, per_page: 15 },
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useWorkOrder(id: string) {
  return useQuery({
    queryKey: technicianKeys.workOrder(id),
    queryFn: async () => (await getWorkOrder(id)).data,
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useWorkOrderTimeline(id: string) {
  return useQuery({
    queryKey: technicianKeys.workOrderTimeline(id),
    queryFn: async () => (await getWorkOrderTimeline(id)).data.items ?? [],
    enabled: !!id,
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

// ── CRUD mutations ─────────────────────────────────────────────────────────

function invalidateWO(qc: ReturnType<typeof useQueryClient>, id?: string) {
  qc.invalidateQueries({ queryKey: technicianKeys.all });
  if (id) qc.invalidateQueries({ queryKey: technicianKeys.workOrder(id) });
}

export function useCreateWorkOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWorkOrderPayload) => createWorkOrder(payload),
    onSuccess: () => {
      toast.success("Work order created");
      invalidateWO(qc);
    },
    onError: () => toast.error("Failed to create work order"),
  });
}

export function useUpdateWorkOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateWorkOrderPayload) => updateWorkOrder(id, payload),
    onSuccess: () => {
      toast.success("Work order updated");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to update work order"),
  });
}

export function useCancelWorkOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CancelWorkOrderPayload) => cancelWorkOrder(id, payload),
    onSuccess: () => {
      toast.success("Work order cancelled");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to cancel work order"),
  });
}

// ── Technician action mutations ────────────────────────────────────────────

export function useAcceptWorkOrder(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AcceptWorkOrderPayload) => acceptWorkOrder(id, payload),
    onSuccess: () => {
      toast.success("Work order accepted");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to accept"),
  });
}

export function useStartJourney(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: JourneyEventPayload) => startJourney(id, payload),
    onSuccess: () => {
      toast.success("Journey started");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to start journey"),
  });
}

export function useRecordArrival(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: JourneyEventPayload) => recordArrival(id, payload),
    onSuccess: () => {
      toast.success("Arrival recorded");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to record arrival"),
  });
}

export function useUpsertProofOfWork(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertProofOfWorkPayload) => upsertProofOfWork(id, payload),
    onSuccess: () => {
      toast.success("Proof of work saved");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to save proof of work"),
  });
}

export function useUpsertResolutionLog(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertResolutionLogPayload) => upsertResolutionLog(id, payload),
    onSuccess: () => {
      toast.success("Resolution log saved");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to save resolution log"),
  });
}

export function useReportIssue(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: IssueReportPayload) => reportIssue(id, payload),
    onSuccess: () => {
      toast.success("Issue reported");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to report issue"),
  });
}

export function useRequestCustomerSignOff(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerSignOffRequestPayload) => requestCustomerSignOff(id, payload),
    onSuccess: () => {
      toast.success("Sign-off requested");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to request sign-off"),
  });
}

export function useConfirmCustomerSignOff(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerSignOffConfirmPayload) => confirmCustomerSignOff(id, payload),
    onSuccess: () => {
      toast.success("Sign-off confirmed");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to confirm sign-off"),
  });
}

export function useSubmitBAST(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitBASTPayload) => submitBAST(id, payload),
    onSuccess: () => {
      toast.success("BAST submitted");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to submit BAST"),
  });
}

// ── Team-leader ────────────────────────────────────────────────────────────

export function useTeamLeaderDashboard(params: TeamLeaderDashboardParams = {}) {
  return useQuery({
    queryKey: technicianKeys.teamLeaderDashboard(params),
    queryFn: async () => (await getTeamLeaderDashboard(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useAutoAssignWorkOrders() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AutoAssignWorkOrdersPayload) => autoAssignWorkOrders(payload),
    onSuccess: () => {
      toast.success("Auto-assign triggered");
      invalidateWO(qc);
    },
    onError: () => toast.error("Failed to auto-assign"),
  });
}

export function useAssignPairing(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertPairingPayload) => assignPairing(id, payload),
    onSuccess: () => {
      toast.success("Pairing assigned");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to assign pairing"),
  });
}

export function useUpdatePairing(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertPairingPayload) => updatePairing(id, payload),
    onSuccess: () => {
      toast.success("Pairing updated");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to update pairing"),
  });
}

export function usePairingRecommendation(id: string) {
  return useMutation({
    mutationFn: (payload: PairingRecommendationPayload) => getPairingRecommendation(id, payload),
    onError: () => toast.error("Failed to fetch pairing recommendation"),
  });
}

// ── NOC ────────────────────────────────────────────────────────────────────

export function useNOCQueue(params: NOCQueueParams = {}) {
  return useQuery({
    queryKey: technicianKeys.nocQueue(params),
    queryFn: async () => {
      const res = await listNOCQueue(params);
      return {
        items: res.data?.items ?? [],
        summary: res.data?.summary ?? { total: 0, installations: 0, maintenance: 0, terminations: 0 },
      };
    },
    placeholderData: {
      items: [],
      summary: { total: 0, installations: 0, maintenance: 0, terminations: 0 },
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useProcessNOCApproval(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProcessNOCApprovalPayload) => processNOCApproval(id, payload),
    onSuccess: () => {
      toast.success("NOC decision saved");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to process NOC approval"),
  });
}

export function useNOCApprovalLog(id: string) {
  return useQuery({
    queryKey: technicianKeys.nocApprovalLog(id),
    queryFn: async () => (await getNOCApprovalLog(id)).data?.items ?? [],
    enabled: !!id,
    placeholderData: [],
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

// ── Warehouse ──────────────────────────────────────────────────────────────

export function useInventoryRequirements(id: string) {
  return useQuery({
    queryKey: technicianKeys.inventoryRequirements(id),
    queryFn: async () => (await getInventoryRequirements(id)).data,
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useVerifyInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyInventoryPayload) => verifyInventory(id, payload),
    onSuccess: () => {
      toast.success("Inventory verified");
      qc.invalidateQueries({ queryKey: technicianKeys.inventoryRequirements(id) });
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to verify inventory"),
  });
}

export function useConfirmDeviceReceipt(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeviceReceiptPayload) => confirmDeviceReceipt(id, payload),
    onSuccess: () => {
      toast.success("Device receipt confirmed");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to confirm device receipt"),
  });
}

export function useWarehouseDispatch(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WarehouseDispatchPayload) => warehouseDispatch(id, payload),
    onSuccess: () => {
      toast.success("Devices dispatched");
      invalidateWO(qc, id);
    },
    onError: () => toast.error("Failed to dispatch devices"),
  });
}

// ── Cross-area ─────────────────────────────────────────────────────────────

export function useCreateCrossAreaRequest(workOrderId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCrossAreaPayload) => createCrossAreaRequest(workOrderId, payload),
    onSuccess: () => {
      toast.success("Cross-area request created");
      invalidateWO(qc, workOrderId);
    },
    onError: () => toast.error("Failed to create cross-area request"),
  });
}

export function useApproveCrossAreaRequest(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewCrossAreaPayload) => approveCrossAreaRequest(id, payload),
    onSuccess: () => {
      toast.success("Cross-area request approved");
      invalidateWO(qc);
    },
    onError: () => toast.error("Failed to approve"),
  });
}

export function useRejectCrossAreaRequest(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewCrossAreaPayload) => rejectCrossAreaRequest(id, payload),
    onSuccess: () => {
      toast.success("Cross-area request rejected");
      invalidateWO(qc);
    },
    onError: () => toast.error("Failed to reject"),
  });
}

// ── Analytics & history ────────────────────────────────────────────────────

export function useRepeatIssues(params: { branch_id?: string; period_days?: number } = {}) {
  return useQuery({
    queryKey: technicianKeys.repeatIssues(params),
    queryFn: async () => (await getRepeatIssues(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useDispatchMap(
  params: { branch_id?: string; area_id?: string; technician_id?: string } = {}
) {
  return useQuery({
    queryKey: technicianKeys.dispatchMap(params),
    queryFn: async () => (await getDispatchMap(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useTechnicianPerformance(
  params: { branch_id?: string; period_days?: number } = {}
) {
  return useQuery({
    queryKey: technicianKeys.technicianPerformance(params),
    queryFn: async () => (await getTechnicianPerformance(params)).data,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useTechnicianHistory(
  technicianId: string,
  params: { branch_id?: string; period_days?: number } = {}
) {
  return useQuery({
    queryKey: technicianKeys.technicianHistory(technicianId, params),
    queryFn: async () => (await getTechnicianWorkOrderHistory(technicianId, params)).data,
    enabled: !!technicianId,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useCustomerHistory(customerId: string) {
  return useQuery({
    queryKey: technicianKeys.customerHistory(customerId),
    queryFn: async () => (await getCustomerWorkOrderHistory(customerId)).data,
    enabled: !!customerId,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useSiteHistory(siteId: string) {
  return useQuery({
    queryKey: technicianKeys.siteHistory(siteId),
    queryFn: async () => (await getSiteWorkOrderHistory(siteId)).data,
    enabled: !!siteId,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}
