import { services } from "@/config/constants";
import { userServiceApi } from "@/features/user-service/api/client";
import type {
  ProductEnvelope,
  BroadbandPlan,
  BroadbandPlanListData,
  BroadbandPlanListParams,
  CreateBroadbandPlanPayload,
  EnterpriseService,
  EnterpriseServiceListData,
  EnterpriseServiceListParams,
  CreateEnterpriseServicePayload,
  Addon,
  AddonListData,
  AddonListParams,
  CreateAddonPayload,
} from "../types/products";

const BASE = services.product;

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

// ─── Public — Broadband Plans ─────────────────────────────────────────────────

export function listActiveBroadbandPlans(params: BroadbandPlanListParams = {}) {
  return cast<ProductEnvelope<BroadbandPlanListData>>(
    userServiceApi.get(`${BASE}/v1/products/broadband-plans`, { params })
  );
}

export function getActiveBroadbandPlan(id: string) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.get(`${BASE}/v1/products/broadband-plans/${id}`)
  );
}

// ─── Public — Enterprise Services ─────────────────────────────────────────────

export function listActiveEnterpriseServices(params: EnterpriseServiceListParams = {}) {
  return cast<ProductEnvelope<EnterpriseServiceListData>>(
    userServiceApi.get(`${BASE}/v1/products/enterprise-services`, { params })
  );
}

export function getActiveEnterpriseService(id: string) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.get(`${BASE}/v1/products/enterprise-services/${id}`)
  );
}

// ─── Public — Add-ons ─────────────────────────────────────────────────────────

export function listActiveAddons(params: AddonListParams = {}) {
  return cast<ProductEnvelope<AddonListData>>(
    userServiceApi.get(`${BASE}/v1/products/addons`, { params })
  );
}

export function getActiveAddon(id: string) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.get(`${BASE}/v1/products/addons/${id}`)
  );
}

// ─── Admin — Broadband Plans ──────────────────────────────────────────────────

export function adminListBroadbandPlans(params: BroadbandPlanListParams = {}) {
  return cast<ProductEnvelope<BroadbandPlanListData>>(
    userServiceApi.get(`${BASE}/v1/admin/broadband-plans`, { params })
  );
}

export function adminGetBroadbandPlan(id: string) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.get(`${BASE}/v1/admin/broadband-plans/${id}`)
  );
}

export function adminCreateBroadbandPlan(payload: CreateBroadbandPlanPayload) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.post(`${BASE}/v1/admin/broadband-plans`, payload)
  );
}

export function adminUpdateBroadbandPlan(id: string, payload: CreateBroadbandPlanPayload) {
  return cast<ProductEnvelope<BroadbandPlan>>(
    userServiceApi.put(`${BASE}/v1/admin/broadband-plans/${id}`, payload)
  );
}

export function adminDeleteBroadbandPlan(id: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/v1/admin/broadband-plans/${id}`)
  );
}

export function adminAddBranchToBroadbandPlan(planId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.post(`${BASE}/v1/admin/broadband-plans/${planId}/branches`, { branch_id: branchId })
  );
}

export function adminRemoveBranchFromBroadbandPlan(planId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/v1/admin/broadband-plans/${planId}/branches/${branchId}`)
  );
}

// ─── Admin — Enterprise Services ──────────────────────────────────────────────

export function adminListEnterpriseServices(params: EnterpriseServiceListParams = {}) {
  return cast<ProductEnvelope<EnterpriseServiceListData>>(
    userServiceApi.get(`${BASE}/v1/admin/enterprise-services`, { params })
  );
}

export function adminGetEnterpriseService(id: string) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.get(`${BASE}/v1/admin/enterprise-services/${id}`)
  );
}

export function adminCreateEnterpriseService(payload: CreateEnterpriseServicePayload) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.post(`${BASE}/v1/admin/enterprise-services`, payload)
  );
}

export function adminUpdateEnterpriseService(id: string, payload: CreateEnterpriseServicePayload) {
  return cast<ProductEnvelope<EnterpriseService>>(
    userServiceApi.put(`${BASE}/v1/admin/enterprise-services/${id}`, payload)
  );
}

export function adminDeleteEnterpriseService(id: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/v1/admin/enterprise-services/${id}`)
  );
}

export function adminAddBranchToEnterpriseService(serviceId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.post(`${BASE}/v1/admin/enterprise-services/${serviceId}/branches`, { branch_id: branchId })
  );
}

export function adminRemoveBranchFromEnterpriseService(serviceId: string, branchId: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/v1/admin/enterprise-services/${serviceId}/branches/${branchId}`)
  );
}

// ─── Admin — Add-ons ──────────────────────────────────────────────────────────

export function adminListAddons(params: AddonListParams = {}) {
  return cast<ProductEnvelope<AddonListData>>(
    userServiceApi.get(`${BASE}/v1/admin/addons`, { params })
  );
}

export function adminGetAddon(id: string) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.get(`${BASE}/v1/admin/addons/${id}`)
  );
}

export function adminCreateAddon(payload: CreateAddonPayload) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.post(`${BASE}/v1/admin/addons`, payload)
  );
}

export function adminUpdateAddon(id: string, payload: CreateAddonPayload) {
  return cast<ProductEnvelope<Addon>>(
    userServiceApi.put(`${BASE}/v1/admin/addons/${id}`, payload)
  );
}

export function adminDeleteAddon(id: string) {
  return cast<ProductEnvelope<null>>(
    userServiceApi.delete(`${BASE}/v1/admin/addons/${id}`)
  );
}
