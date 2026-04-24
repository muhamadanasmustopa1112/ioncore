import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  SalesEnvelope,
  LeadDto,
  LeadDetail,
  LeadListResponse,
  LeadListParams,
  LeadStatusTimelineDto,
  LeadActivityDto,
  CreateLeadPayload,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
  CreateLeadActivityPayload,
  RerouteLeadPayload,
} from "../types/leads-api";

const BASE = `${services.sales}/v1`;
const SALES = `${BASE}/sales/leads`;
const ADMIN = `${BASE}/admin/leads`;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

// ─── Public (sales user) ─────────────────────────────────────────────────────

export function createLead(payload: CreateLeadPayload) {
  return cast<SalesEnvelope<LeadDto>>(userServiceApi.post(SALES, payload));
}

export function listMyLeads(params: Pick<LeadListParams, "page" | "per_page"> = {}) {
  return cast<SalesEnvelope<LeadListResponse>>(
    userServiceApi.get(SALES, {
      params: { page: params.page ?? 1, per_page: params.per_page ?? 25 },
    })
  );
}

export function getLead(id: string) {
  return cast<SalesEnvelope<LeadDetail>>(userServiceApi.get(`${SALES}/${id}`));
}

export function getLeadTimeline(id: string) {
  return cast<SalesEnvelope<LeadStatusTimelineDto[]>>(
    userServiceApi.get(`${SALES}/${id}/timeline`)
  );
}

export function updateLeadStatus(id: string, payload: UpdateLeadStatusPayload) {
  return cast<SalesEnvelope<LeadDto>>(
    userServiceApi.patch(`${SALES}/${id}/status`, payload)
  );
}

export function updateLeadCableDistance(id: string, cable_distance_meters: number) {
  return cast<SalesEnvelope<LeadDto>>(
    userServiceApi.patch(`${SALES}/${id}/cable-distance`, { cable_distance_meters })
  );
}

export function updateLeadCableAcceptance(id: string, is_excess_cable_accepted: boolean) {
  return cast<SalesEnvelope<LeadDto>>(
    userServiceApi.patch(`${SALES}/${id}/cable-acceptance`, { is_excess_cable_accepted })
  );
}

export function createLeadActivity(id: string, payload: CreateLeadActivityPayload) {
  return cast<SalesEnvelope<LeadActivityDto>>(
    userServiceApi.post(`${SALES}/${id}/activities`, payload)
  );
}

export function updateLeadActivity(
  leadId: string,
  activityId: string,
  payload: CreateLeadActivityPayload
) {
  return cast<SalesEnvelope<LeadActivityDto>>(
    userServiceApi.put(`${SALES}/${leadId}/activities/${activityId}`, payload)
  );
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function listLeadsAdmin(params: LeadListParams = {}) {
  return cast<SalesEnvelope<LeadListResponse>>(
    userServiceApi.get(ADMIN, {
      params: {
        branch_id: params.branch_id,
        name: params.name,
        assigned_sales_id: params.assigned_sales_id,
        sort_by: params.sort_by ?? "created_at",
        sort_dir: params.sort_dir ?? "desc",
        page: params.page ?? 1,
        per_page: params.per_page ?? 25,
      },
    })
  );
}

export function updateLeadAdmin(id: string, payload: UpdateLeadPayload) {
  return cast<SalesEnvelope<LeadDto>>(userServiceApi.put(`${ADMIN}/${id}`, payload));
}

export function rerouteLead(id: string, payload: RerouteLeadPayload) {
  return cast<SalesEnvelope<LeadDto>>(
    userServiceApi.patch(`${ADMIN}/${id}/reroute`, payload)
  );
}
