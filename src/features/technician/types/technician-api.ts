// ── Enums ──────────────────────────────────────────────────────────────────

export type WorkOrderState =
  | "created"
  | "unassigned"
  | "assigned"
  | "accepted"
  | "dispatched"
  | "in_progress"
  | "pending_noc_verification"
  | "completed"
  | "rescheduled"
  | "cancelled";

export type WorkOrderType =
  | "new_installation_broadband"
  | "new_installation_enterprise"
  | "maintenance"
  | "termination";

export type WorkOrderPriority = "low" | "medium" | "high" | "urgent";

export type CustomerSignOffMode = "in_person" | "remote_otp";
export type CustomerSignOffStatus = "pending" | "requested" | "confirmed" | "expired";
export type NOCApprovalDecision = "approved" | "rejected" | "redispatch";
export type DeviceDispositionType = "deployed" | "returned" | "swapped";
export type EvidenceType = "photo" | "video" | "document" | "signature";
export type OTPStatus = "pending" | "issued" | "verified" | "expired";
export type InventoryRequirementStatus = "pending" | "verified" | "fulfilled";
export type InventoryVerificationStatus = "pending" | "approved" | "rejected";
export type InventoryVerificationInputMethod = "qr_scan" | "manual" | "photo";
export type ResolutionStatus = "open" | "in_progress" | "resolved" | "deferred";
export type ProofOfWorkFieldType = "checkbox" | "text" | "number" | "photo" | "signature";
export type BillingTriggerStatus = "pending" | "triggered" | "skipped";
export type CrossAreaRequestStatus = "pending" | "approved" | "rejected";
export type TechnicianLevel = "junior" | "senior" | "lead";
export type TechnicianAvailabilityStatus = "available" | "on_leave" | "on_other_wo" | "cross_area";
export type DailyWorkOrderAllocationType = "base" | "overflow";
export type DailyWorkTeamType = "regular" | "cross_area";
export type CoverageLevel = "branch" | "area" | "sub_area";

// ── Shared ─────────────────────────────────────────────────────────────────

export interface Metadata {
  count: number;
  page: number;
  per_page: number;
}

export interface ResponseEnvelope<T> {
  data: T;
  message?: string;
  error?: string;
  metadata?: Metadata;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  recorded_at?: string;
}

export interface EvidenceRecord {
  type: EvidenceType;
  url: string;
  caption?: string;
  recorded_at?: string;
  technician_id?: string;
}

export interface OTPChallenge {
  status: OTPStatus;
  delivery_channel?: string;
  destination?: string;
  expires_at?: string;
  issued_at?: string;
}

// ── Technician / team ──────────────────────────────────────────────────────

export interface AssignedTechnician {
  technician_id: string;
  technician_name: string;
  role: string;
  level: TechnicianLevel;
  accepted: boolean;
  accepted_at: string | null;
  active_workload: number;
  area_id: string;
  branch_id: string;
  sub_area_id: string;
  cross_area: boolean;
  employee_id: string;
  skills: string[];
}

export interface TechnicianLatestLocation {
  active_workload: number;
  area_id: string;
  availability_status: TechnicianAvailabilityStatus;
  branch_id: string;
  latest_location: {
    latitude: number;
    longitude: number;
    recorded_at: string;
  } | null;
  role: string;
  sub_area_id: string;
  technician_id: string;
  technician_name: string;
}

export interface TechnicianLatestLocationsResponse {
  items: TechnicianLatestLocation[];
}


export interface AssignmentSLA {
  due_at: string;
  warning_at_percent: number;
  window_minutes: number;
  breached_at: string | null;
  warning_triggered_at: string | null;
  auto_assign_enabled: boolean;
}

// ── Work order list (dashboard) ────────────────────────────────────────────

export interface WorkOrderDashboardItem {
  id: string;
  number: string;
  title: string;
  type: WorkOrderType;
  state: WorkOrderState;
  priority: WorkOrderPriority;
  customer_id?: string;
  customer_name: string;
  customer_phone?: string;
  customer_email?: string;
  site_name: string;
  area_id: string;
  sub_area_id: string;
  branch_id: string;
  queue_owner_id: string;
  queue_owner_name: string;
  requested_installation: string;
  assigned_team: AssignedTechnician[];
  assignment_sla: AssignmentSLA;
  cross_area?: boolean;
}

export interface WorkOrderDashboardSummary {
  total: number;
  by_state: Record<WorkOrderState, number>;
  by_type: Record<WorkOrderType, number>;
}

export interface WorkOrderDashboardResponse {
  items: WorkOrderDashboardItem[];
  summary: WorkOrderDashboardSummary;
}

export interface WorkOrderDashboardEnvelope {
  data: WorkOrderDashboardResponse;
  metadata: Metadata;
}

export interface WorkOrderListParams {
  type?: WorkOrderType | "";
  state?: WorkOrderState | "";
  priority?: WorkOrderPriority | "";
  area_id?: string;
  sub_area_id?: string;
  queue_owner_id?: string;
  technician_id?: string;
  page?: number;
  per_page?: number;
  order?: "asc" | "desc";
  sort_by?: string;
  branch_id?: string;
  date?: string;
}

// ── Work order detail ──────────────────────────────────────────────────────

export interface AcceptanceRecord {
  technician_id: string;
  accepted_at: string;
  note?: string;
}

export interface JourneyEvent {
  technician_id: string;
  latitude: number;
  longitude: number;
  note?: string;
  recorded_at: string;
}

export interface ExecutionJourney {
  acceptances: AcceptanceRecord[];
  arrival: JourneyEvent | null;
  journey_started: JourneyEvent | null;
  last_known_gps: GeoPoint | null;
}

export interface ProofOfWorkItem {
  item_id: string;
  template_id: string;
  item_label: string;
  category: string;
  field_type: ProofOfWorkFieldType;
  value: string;
  notes: string;
  required: boolean;
  checked: boolean;
  completed: boolean;
  completed_at?: string;
  completed_by?: string;
  evidence: EvidenceRecord[];
}

export interface ResolutionLogItem {
  item_id: string;
  item_label: string;
  category: string;
  finding: string;
  action_taken: string;
  resolution_status: ResolutionStatus | "";
  time_spent_minutes?: number;
  time_spent_hh_mm_ss?: string;
  resolved_by_user_id?: string;
  timestamp?: string;
}

export interface IssueReport {
  reason_code: string;
  note: string;
  reported_at: string;
  reported_by: string;
  reported_role: string;
  request_reschedule: boolean;
  evidence: EvidenceRecord[];
}

export interface CustomerSignOff {
  status: CustomerSignOffStatus;
  mode: CustomerSignOffMode;
  signed_by: string;
  signature_url: string;
  requested_at: string;
  confirmed_at: string;
  remote_otp: OTPChallenge | null;
}

export interface BASTSubmission {
  id?: string;
  summary: string;
  flags?: string[];
  submitted_at: string;
  submitted_by: string;
  submitted_role: string;
  work_duration?: string;
}

export interface NOCApprovalLogEntry {
  id: string;
  decision: NOCApprovalDecision;
  note: string;
  actor_id: string;
  actor_role: string;
  created_at: string;
}

export interface NOCApproval {
  decision: NOCApprovalDecision;
  note: string;
  reviewed_at: string;
  reviewed_by: string;
  reviewed_role: string;
  billing_trigger: BillingTriggerStatus;
  radius_trigger: BillingTriggerStatus;
  requires_redispatch: boolean;
}

export interface DeviceDisposition {
  type: DeviceDispositionType;
  device_serial: string;
  decided_at: string;
  decided_by: string;
}

export interface Reschedule {
  rescheduled_to: string;
  reason: string;
  requested_by: string;
  requested_at: string;
}

export interface WorkOrderRouting {
  resolved_branch_id: string;
  resolved_area_id: string;
  resolved_sub_area_id: string;
  routed_to_user_id: string;
  routed_to_role: string;
  escalated_at: string | null;
}

export interface ONTConfiguration {
  serial_number: string;
  authentication_status: string;
  expected_bandwidth_down_mbps: number;
  expected_bandwidth_up_mbps: number;
  radius_password: string;
  radius_username: string;
  credentials_visible?: boolean;
  model: string;
  ip_address: string;
  vlan_id: string;
  odp_id: string;
  odp_slot: string;
  odp_location_lat: number;
  odp_location_lng: number;
  cable_distance_meters: number;
}

export interface WarehouseDispatch {
  warehouse_branch_id: string;
  dispatched_at: string;
  dispatched_by_name: string;
  dispatched_by: string;
  warehouse_branch: WarehouseBranch;
  devices: WarehouseDevice[];
  note: string;
}

export interface Branch {
  code: string;
  id: string;
  name: string;
}

export interface CableConsumption {
  cable_used_meters: number;
  remnant_meters: number;
  recorded_by: string;
  recorded_role: string;
  recorded_at: string;
  recorded_by_user: {
    id: string;
    name: string;
    role: string;
    code: string;
    type: string
  }
  remnant_returned: boolean;
  note: string;
}

export interface WarehouseDevice {
  device_serial: string;
  device_type: string;
  qr_code: string;
  picked_up: boolean;
  picked_up_at?: string;
}

export interface WarehouseBranch {
  code: string;
  id: string;
  name: string;
}

export interface WorkOrderTimelineItem {
  id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  from_state: WorkOrderState | null;
  to_state: WorkOrderState | null;
  note: string;
  cable_excess_meter?: number;
  cable_excess_price?: number;
  created_at: string;
}

export interface WorkOrderHistoryItem {
  id?: string;
  work_order_id: string;
  number: string;
  type: WorkOrderType;
  state: WorkOrderState;
  completed_at: string;
  technician_names: string[];
  summary: string;
}

export interface AuditTrailEntry {
  id: string;
  action: string;
  actor_id: string;
  actor_role: string;
  metadata?: {
    added_technician?: string;
    added_technician_names?: string;
    new_pair?: string;
    new_pair_names?: string;
    original_pair?: string;
    original_pair_names?: string;
    reassignment_mode?: string;
    removed_technician?: string;
    removed_technician_names?: string;
  };
  created_at: string;
}

export interface WorkOrderDetailResponse {
  id: string;
  number: string;
  title: string;
  type: WorkOrderType;
  state: WorkOrderState;
  priority: WorkOrderPriority;
  description: string;
  inventory_reservation_status?: "reserved" | "pending";
  temporary_provisioning_status?: "TEMPORARY_PENDING" | "TEMPORARY_ACTIVE" | "TEMPORARY" | "TEMPORARY_FAILURE" | "FAILED" | "EXPIRED" | null;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  site_id: string;
  site_name: string;
  site_address: string;
  latitude: number;
  longitude: number;
  navigation_url: string;
  package_name: string;
  product_type: string;
  service_type: string;
  area_id: string;
  area_name: string;
  sub_area_id: string;
  sub_area_name: string;
  branch_id: string;
  branch_name: string;
  branch: Branch;
  requested_installation: string;
  requested_at: string;
  created_at: string;
  updated_at: string;
  assigned_team: AssignedTechnician[];
  assignment_sla: AssignmentSLA;
  routing?: WorkOrderRouting;
  execution?: ExecutionJourney;
  timeline: WorkOrderTimelineItem[];
  ont_configuration: ONTConfiguration | null;
  required_skills: string[];
  proof_of_work: ProofOfWorkItem[];
  resolution_log: ResolutionLogItem[];
  issue_report?: IssueReport;
  customer_sign_off?: CustomerSignOff;
  bast?: BASTSubmission;
  noc_approval?: NOCApproval;
  noc_approval_log?: NOCApprovalLogEntry[];
  device_disposition?: DeviceDisposition;
  reschedule?: Reschedule;
  warehouse_dispatch?: WarehouseDispatch;
  cable_consumption?: CableConsumption | null;
  previous_customer_jobs?: WorkOrderHistoryItem[];
  previous_site_jobs?: WorkOrderHistoryItem[];
  audit_trail?: AuditTrailEntry[];
}

export interface WorkOrderDetailEnvelope {
  data: WorkOrderDetailResponse;
}



// ── Work order: create / update / cancel ───────────────────────────────────

export interface CreateWorkOrderPayload {
  actor_id?: string;
  actor_role?: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  title: string;
  description?: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  site_id?: string;
  site_name?: string;
  site_address?: string;
  latitude?: number;
  longitude?: number;
  package_name?: string;
  product_type?: string;
  service_type?: string;
  branch_id?: string;
  branch_name?: string;
  area_id?: string;
  area_name?: string;
  sub_area_id?: string;
  sub_area_name?: string;
  requested_installation?: string;
  required_skills?: string[];
  assignment_window_minutes?: number;
  ont_configuration?: Partial<ONTConfiguration>;
  proof_of_work_items?: Partial<ProofOfWorkItem>[];
  resolution_log_items?: Partial<ResolutionLogItem>[];
}

export interface UpdateWorkOrderPayload {
  actor_id?: string;
  actor_role?: string;
  title?: string;
  description?: string;
  package_name?: string;
  priority?: WorkOrderPriority;
  requested_installation?: string;
  note?: string;
}

export interface CancelWorkOrderPayload {
  actor_id?: string;
  actor_role?: string;
  reason_code: string;
  note?: string;
}

// ── Timeline ───────────────────────────────────────────────────────────────

export interface WorkOrderTimelineEnvelope {
  data: { items: WorkOrderTimelineItem[] };
}

// ── Technician actions ─────────────────────────────────────────────────────

export interface AcceptWorkOrderPayload {
  technician_id: string;
  note?: string;
}

export interface JourneyEventPayload {
  technician_id: string;
  latitude: number;
  longitude: number;
  note?: string;
}

export interface UpsertProofOfWorkPayload {
  technician_id: string;
  note?: string;
  items: Partial<ProofOfWorkItem>[];
}

export interface UpsertResolutionLogPayload {
  technician_id: string;
  note?: string;
  items: Partial<ResolutionLogItem>[];
}

export interface IssueReportPayload {
  actor_id?: string;
  actor_role?: string;
  reason_code: string;
  note?: string;
  request_reschedule?: boolean;
  new_schedule_at?: string;
  devices_returned?: boolean;
  evidence?: EvidenceRecord[];
}

export interface CustomerSignOffRequestPayload {
  technician_id: string;
  mode: CustomerSignOffMode;
  delivery_channel?: string;
  destination?: string;
  note?: string;
}

export interface CustomerSignOffConfirmPayload {
  technician_id: string;
  mode: CustomerSignOffMode;
  signed_by: string;
  signature_url?: string;
  otp_code?: string;
  note?: string;
}

export interface SubmitBASTPayload {
  actor_id?: string;
  actor_role?: string;
  summary: string;
  note?: string;
}

// ── Team-leader ────────────────────────────────────────────────────────────

export interface TeamLeaderDailySummary {
  completed_today: number;
  pending_today: number;
  rescheduled_today: number;
}

export interface TechnicianAvailabilityItem {
  technician_id: string;
  technician_name: string;
  level: TechnicianLevel;
  availability_status: TechnicianAvailabilityStatus;
  active_workload: number;
  skills: string[];
  area_id: string;
  sub_area_id: string;
}

export interface DashboardAlert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  created_at: string;
  related_id?: string;
}

export interface DailyWorkTeam {
  type: DailyWorkTeamType;
  team_id: string;
  members: AssignedTechnician[];
}

export interface DailyWorkOrderAllocation {
  type: DailyWorkOrderAllocationType;
  work_order_id: string;
  work_order_number: string;
  team_id: string;
  scheduled_at: string;
}

export interface DailyAssignmentDashboard {
  branch_id: string;
  area_id: string;
  sub_area_id: string;
  operating_date: string;
  base_quota: number;
  overflow_total: number;
  overflow_remaining: number;
  allocations: DailyWorkOrderAllocation[];
  teams?: DailyWorkTeam[];
}

export interface CrossAreaRequest {
  id: string;
  work_order_id?: string;
  status: CrossAreaRequestStatus;
  requesting_area_id: string;
  requesting_leader_id: string;
  requesting_leader_name: string;
  lending_area_id: string;
  lending_leader_id: string;
  lending_leader_name: string;
  candidate_technician_ids: string[];
  approved_technician_ids: string[];
  note: string;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  reviewed_by: string;
  reviewed_role: string;
}

export interface LiveLocation {
  latitude: number;
  longitude: number;
  recorded_at: string;
}

export interface DispatchRouteStop {
  work_order_id: string;
  work_order_number: string;
  site_name: string;
  latitude: number;
  longitude: number;
  sequence: number;
  eta_in_minutes: number;
  priority: string;
}

export interface DispatchRoute {
  technician_id: string;
  technician_name: string;
  stops: DispatchRouteStop[];
}

export interface DispatchMapItem {
  work_order_id: string;
  work_order_number: string;
  title: string;
  type: string;
  state: string;
  priority: string;
  customer_name: string;
  site_name: string;
  latitude: number;
  longitude: number;
  live_location: LiveLocation | null;
  live_source?: string;
  live_updated_at?: string;
  assigned_team?: AssignedTechnician[];
  branch_id: string;
  area_id: string;
  cluster_id?: string;
}

export interface DispatchMapCluster {
  cluster_id: string;
  area_id: string;
  branch_id: string;
  center_lat: number;
  center_lng: number;
  total: number;
  by_state?: Record<string, number>;
}

export interface DispatchMapResponse {
  items: DispatchMapItem[];
  clusters: DispatchMapCluster[];
  routes?: DispatchRoute[];
  filters?: {
    branch_id?: string;
    area_id?: string;
    technician_id?: string;
  };
}

export interface DispatchMapParams {
  branch_id?: string;
  area_id?: string;
  state?: string;
  type?: string;
  technician_id?: string;
}

export interface TeamLeaderDashboardResponse {
  daily_summary: TeamLeaderDailySummary;
  daily_assignment: DailyAssignmentDashboard;
  queue: WorkOrderDashboardItem[];
  availability_board: TechnicianAvailabilityItem[];
  cross_area_requests: CrossAreaRequest[];
  alerts: DashboardAlert[];
  map: DispatchMapResponse;
  auto_assign_enabled: boolean;
}

export interface TeamLeaderDashboardEnvelope {
  data: TeamLeaderDashboardResponse;
}

export interface TeamLeaderDashboardParams {
  leader_id?: string;
  branch_id?: string;
  area_id?: string;
  sub_area_id?: string;
  state?: string;
  type?: string;
  date?: string;
}

export interface AutoAssignWorkOrdersPayload {
  actor_id?: string;
  actor_role?: string;
  branch_id?: string;
  area_id?: string;
  sub_area_id?: string;
  leader_id?: string;
  date?: string;
  note?: string;
}

export interface AutoAssignWorkOrdersResponse {
  branch_id: string;
  area_id: string;
  sub_area_id: string;
  leader_id: string;
  operating_date: string;
  total_work_orders: number;
  total_teams: number;
  total_batches: number;
  overflow_total: number;
  overflow_remaining: number;
  triggered_at: string;
  batches: DailyAssignmentDashboard[];
}

export interface UpsertPairingPayload {
  actor_id?: string;
  actor_role?: string;
  technician_ids: string[];
  use_auto_pairing?: boolean;
  override_current?: boolean;
  note?: string;
}

export interface PairingRecommendationPayload {
  actor_id?: string;
  actor_role?: string;
  candidate_technician_ids?: string[];
  use_auto_pairing?: boolean;
  note?: string;
}

export interface DispatchCandidate {
  technician_id: string;
  technician_name: string;
  level: TechnicianLevel;
  active_workload: number;
  skills: string[];
  area_id: string;
  sub_area_id: string;
  cross_area: boolean;
  match_score: number;
  reasons: string[];
  availability_status: TechnicianAvailabilityStatus;
}

export interface PairingRecommendationResponse {
  work_order_id: string;
  work_order_number: string;
  priority: WorkOrderPriority;
  priority_reason: string;
  candidates: DispatchCandidate[];
  suggested_team: AssignedTechnician[];
}

// ── NOC ────────────────────────────────────────────────────────────────────

export interface NOCQueueItem {
  work_order_id: string;
  work_order_number: string;
  title: string;
  type: WorkOrderType;
  state: WorkOrderState;
  priority: WorkOrderPriority;
  branch_id: string;
  area_id: string;
  flags: string[];
  submitted_at: string;
  assigned_team: AssignedTechnician[];
}

export interface NOCQueueSummary {
  total: number;
  installations: number;
  maintenance: number;
  terminations: number;
}

export interface NOCQueueResponse {
  items: NOCQueueItem[];
  summary: NOCQueueSummary;
}

export interface NOCQueueEnvelope {
  data: NOCQueueResponse;
}

export interface NOCQueueParams {
  type?: WorkOrderType | "";
  branch_id?: string;
}

export interface ProcessNOCApprovalPayload {
  actor_id?: string;
  actor_role?: string;
  decision: NOCApprovalDecision;
  note?: string;
  device_disposition?: DeviceDispositionType;
  next_work_order_id?: string;
}

// ── Warehouse ──────────────────────────────────────────────────────────────

export interface WorkOrderInventoryRequirement {
  id: string;
  work_order_id: string;
  branch_id: string;
  device_type: string;
  item_label: string;
  required_quantity: number;
  status: InventoryRequirementStatus;
  activated_at?: string;
  activated_by_user_id?: string;
  verified_by_user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderInventoryVerification {
  id: string;
  work_order_id: string;
  requirement_id: string;
  inventory_id: string;
  technician_id?: string;
  assigned_technician_id?: string;
  input_method: InventoryVerificationInputMethod;
  link_photo?: string;
  note?: string;
  status: InventoryVerificationStatus;
  verified_by_user_id?: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkOrderInventoryRequirementsResponse {
  work_order_id: string;
  items: WorkOrderInventoryRequirement[];
  verifications: WorkOrderInventoryVerification[];
}

export interface VerifyInventoryPayload {
  technician_id: string;
  requirement_id: string;
  inventory_id: string;
  input_method: InventoryVerificationInputMethod;
  link_photo?: string;
  note?: string;
}

export interface DeviceReceiptPayload {
  technician_id: string;
  note?: string;
  devices: { device_serial: string; qr_code?: string; received: boolean }[];
}

export interface WarehouseDispatchPayload {
  actor_id?: string;
  actor_role?: string;
  warehouse_branch_id: string;
  note?: string;
  devices: {
    device_serial: string;
    device_type: string;
    qr_code: string;
  }[];
}

// ── Cross-area ─────────────────────────────────────────────────────────────

export interface CreateCrossAreaPayload {
  actor_id?: string;
  actor_role?: string;
  lending_area_id: string;
  lending_leader_id: string;
  lending_leader_name: string;
  requesting_leader_name: string;
  candidate_technician_ids: string[];
  note?: string;
}

export interface ReviewCrossAreaPayload {
  actor_id?: string;
  actor_role?: string;
  approved_technician_ids?: string[];
  note?: string;
}

// ── Analytics & history ────────────────────────────────────────────────────

export interface RepeatIssueItem {
  customer_id: string;
  customer_name: string;
  site_id: string;
  site_name: string;
  occurrences: number;
  last_occurrence_at: string;
  reason_codes: string[];
}

export interface RepeatIssueDetectionResponse {
  items: RepeatIssueItem[];
  period_days: number;
  branch_id?: string;
}

export interface TechnicianPerformanceItem {
  technician_id: string;
  technician_name: string;
  level: TechnicianLevel;
  total_work_orders: number;
  completed_count: number;
  cancelled_count: number;
  on_time_rate: number;
  avg_resolution_minutes: number;
  customer_rating: number;
}

export interface TechnicianPerformanceResponse {
  items: TechnicianPerformanceItem[];
  period_days: number;
  branch_id?: string;
}

export interface TechnicianHistorySummary {
  total_jobs: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
}

export interface TechnicianWorkOrderHistoryResponse {
  technician_id: string;
  summary: TechnicianHistorySummary;
  items: WorkOrderHistoryItem[];
}

export interface WorkOrderHistoryResponse {
  items: WorkOrderHistoryItem[];
  total: number;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface RequestTemporaryRadiusPayload {
  actor_id: string;
  actor_role: string;
  note: string;
}

export interface ListTechniciansParams {
  branch_id?: string;
  team_leader_id?: string;
}

export interface ListTechnicianItem {
  active_workload: number;
  area_id: string;
  availability_status: string;
  branch_id: string;
  cross_area_enabled: boolean;
  employee_id: string;
  level: string;
  skills: string[];
  sub_area_id: string;
  team_leader_area_id: string;
  team_leader_id: string;
  team_leader_name: string;
  team_leader_role: string;
  team_leader_sub_area_id: string;
  technician_id: string;
  technician_name: string;
  user_email: string;
  user_id: string;
}

export interface ListTechniciansResponse {
  items: ListTechnicianItem[];
}

