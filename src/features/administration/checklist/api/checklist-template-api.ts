import { api } from "@/lib/api-client";
import type {
  ChecklistTemplateDto,
  ChecklistTemplateListResponse,
  ChecklistTemplatePayload,
} from "../types/checklist-template-api";

const BASE = "/administration/wo-checklist-templates";

function cast<T>(p: unknown): Promise<T> {
  return p as Promise<T>;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T | null;
}

export function listTemplates(params: { page?: number; per_page?: number } = {}) {
  return cast<ApiResponse<ChecklistTemplateListResponse>>(
    api.get(BASE, { params: { page: params.page ?? 1, per_page: params.per_page ?? 50 } })
  );
}

export function getTemplate(id: string) {
  return cast<ApiResponse<ChecklistTemplateDto>>(api.get(`${BASE}/${id}`));
}

export function createTemplate(payload: ChecklistTemplatePayload) {
  return cast<ApiResponse<ChecklistTemplateDto>>(api.post(BASE, payload));
}

export function updateTemplate(id: string, payload: Partial<ChecklistTemplatePayload>) {
  return cast<ApiResponse<ChecklistTemplateDto>>(api.patch(`${BASE}/${id}`, payload));
}

export function deleteTemplate(id: string) {
  return cast<ApiResponse<null>>(api.delete(`${BASE}/${id}`));
}

export function publishTemplate(id: string) {
  return cast<ApiResponse<ChecklistTemplateDto>>(api.post(`${BASE}/${id}/publish`));
}

export function cloneTemplate(id: string) {
  return cast<ApiResponse<ChecklistTemplateDto>>(api.post(`${BASE}/${id}/clone`));
}
