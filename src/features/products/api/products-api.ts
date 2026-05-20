import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  ProductEnvelope,
  BroadbandPlan,
  BroadbandPlanListData,
  BroadbandPlanListParams,
  BroadbandPlanBranchesData,
  CreateBroadbandPlanPayload,
  RejectBroadbandPlanPayload,
  SetBroadbandPlanVisibilityPayload,
  EnterpriseService,
  EnterpriseServiceListData,
  EnterpriseServiceListParams,
  CreateEnterpriseServicePayload,
  Addon,
  AddonListData,
  AddonListParams,
  CreateAddonPayload,
  UpdateAddonPayload,
} from "../types/products";

const BASE = services.product;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

// ─── Public — Broadband Plans ─────────────────────────────────────────────────

export function listActiveBroadbandPlans(params: BroadbandPlanListParams = {}) {
  return cast<ProductEnvelope<BroadbandPlanListData>>(
    userServiceApi.get(`${BASE}/products/broadband-plans`, { params })
  );
}

export function getActiveBroadbandPlan(id: string) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.get(`${BASE}/products/broadband-plans/${id}`)
  );
}

// ─── Public — Enterprise Services ─────────────────────────────────────────────

export function listActiveEnterpriseServices(params: EnterpriseServiceListParams = {}) {
  return cast<ProductEnvelope<EnterpriseServiceListData>>(
    userServiceApi.get(`${BASE}/products/enterprise-services`, { params })
  );
}

export function getActiveEnterpriseService(id: string) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.get(`${BASE}/products/enterprise-services/${id}`)
  );
}

// ─── Public — Add-ons ─────────────────────────────────────────────────────────

export function listActiveAddons(params: AddonListParams = {}) {
  return cast<ProductEnvelope<AddonListData>>(
    userServiceApi.get(`${BASE}/products/addons`, { params })
  );
}

export function getActiveAddon(id: string) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.get(`${BASE}/products/addons/${id}`)
  );
}

// ─── Admin — Broadband Plans ──────────────────────────────────────────────────

export function adminListBroadbandPlans(params: BroadbandPlanListParams = {}) {
  return cast<ProductEnvelope<BroadbandPlanListData>>(
    userServiceApi.get(`${BASE}/admin/broadband-plans`, { params })
  );
}

export function adminGetBroadbandPlan(id: string) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.get(`${BASE}/admin/broadband-plans/${id}`)
  );
}

export function adminCreateBroadbandPlan(payload: CreateBroadbandPlanPayload) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.post(`${BASE}/admin/broadband-plans`, payload)
  );
}

export function adminUpdateBroadbandPlan(id: string, payload: CreateBroadbandPlanPayload) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.put(`${BASE}/admin/broadband-plans/${id}`, payload)
  );
}

export function adminDeleteBroadbandPlan(id: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/admin/broadband-plans/${id}`)
  );
}

export function adminGetBroadbandPlanBranches(planId: string) {
  return cast<ProductEnvelope<BroadbandPlanBranchesData>>(
    userServiceApi.get(`${BASE}/admin/broadband-plans/${planId}/branches`)
  );
}

export function adminAddBranchToBroadbandPlan(planId: string, branchIds: string[]) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.post(`${BASE}/admin/broadband-plans/${planId}/branches`, { branch_ids: branchIds })
  );
}

export function adminRemoveBranchFromBroadbandPlan(planId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/admin/broadband-plans/${planId}/branches/${branchId}`)
  );
}

export function adminSubmitReviewBroadbandPlan(id: string) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.post(`${BASE}/admin/broadband-plans/${id}/submit-review`, {})
  );
}

export function adminApproveBroadbandPlan(id: string, payload: { notes?: string } = {}) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.post(`${BASE}/admin/broadband-plans/${id}/approve`, payload)
  );
}

export function adminRejectBroadbandPlan(id: string, payload: RejectBroadbandPlanPayload = {}) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.post(`${BASE}/admin/broadband-plans/${id}/reject`, payload)
  );
}

export function adminSetBroadbandPlanVisibility(id: string, payload: SetBroadbandPlanVisibilityPayload) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.post(`${BASE}/admin/broadband-plans/${id}/visibility`, payload)
  );
}

// ─── Admin — Enterprise Services ──────────────────────────────────────────────

export function adminListEnterpriseServices(params: EnterpriseServiceListParams = {}) {
  return cast<ProductEnvelope<EnterpriseServiceListData>>(
    userServiceApi.get(`${BASE}/admin/enterprise-services`, { params })
  );
}

export function adminGetEnterpriseService(id: string) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.get(`${BASE}/admin/enterprise-services/${id}`)
  );
}

export function adminCreateEnterpriseService(payload: CreateEnterpriseServicePayload) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.post(`${BASE}/admin/enterprise-services`, payload)
  );
}

export function adminUpdateEnterpriseService(id: string, payload: CreateEnterpriseServicePayload) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.put(`${BASE}/admin/enterprise-services/${id}`, payload)
  );
}

export function adminDeleteEnterpriseService(id: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/admin/enterprise-services/${id}`)
  );
}

export function adminAddBranchToEnterpriseService(serviceId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.post(`${BASE}/admin/enterprise-services/${serviceId}/branches`, { branch_id: branchId })
  );
}

export function adminRemoveBranchFromEnterpriseService(serviceId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/admin/enterprise-services/${serviceId}/branches/${branchId}`)
  );
}

// ─── Admin — Add-ons ──────────────────────────────────────────────────────────

export function adminListAddons(params: AddonListParams = {}) {
  return cast<ProductEnvelope<AddonListData>>(
    userServiceApi.get(`${BASE}/admin/addons`, { params })
  );
}

export function adminGetAddon(id: string) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.get(`${BASE}/admin/addons/${id}`)
  );
}

export function adminCreateAddon(payload: CreateAddonPayload) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.post(`${BASE}/admin/addons`, payload)
  );
}

export function adminUpdateAddon(id: string, payload: UpdateAddonPayload) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.put(`${BASE}/admin/addons/${id}`, payload)
  );
}

export function adminDeleteAddon(id: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/admin/addons/${id}`)
  );
}
