import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ChecklistTemplate, Step, Capture, CompletionRules } from "../types/checklist-template";
import type {
  ChecklistTemplateDto,
  StepDto,
  CaptureDto,
  ChecklistTemplatePayload,
} from "../types/checklist-template-api";
import {
  cloneTemplate,
  createTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  publishTemplate,
  updateTemplate,
} from "./checklist-template-api";

export const templateKeys = {
  all: ["checklist-templates"] as const,
  list: (params?: object) => [...templateKeys.all, "list", params ?? {}] as const,
  detail: (id: string) => [...templateKeys.all, "detail", id] as const,
};

function mapCapture(dto: CaptureDto): Capture {
  return {
    captureId: dto.capture_id,
    type: dto.type,
    label: dto.label,
    required: dto.required,
    constraints: dto.constraints ?? {},
  };
}

function mapStep(dto: StepDto): Step {
  return {
    stepId: dto.step_id,
    order: dto.order,
    title: dto.title,
    instructionMarkdown: dto.instruction_markdown ?? "",
    required: dto.required,
    when: dto.when ?? "",
    captures: (dto.captures ?? []).map(mapCapture),
  };
}

function mapTemplate(dto: ChecklistTemplateDto): ChecklistTemplate {
  return {
    id: dto.id,
    schemaName: dto.schema_name,
    schemaVersion: dto.schema_version,
    woType: dto.wo_type,
    maintenanceSubtype: dto.maintenance_subtype ?? null,
    productType: dto.product_type,
    appliesToPackageCodes: dto.applies_to_package_codes ?? [],
    description: dto.description ?? "",
    status: dto.status,
    steps: (dto.steps ?? []).map(mapStep),
    completionRules: {
      blockBastUntilAllRequired: dto.completion_rules?.block_bast_until_all_required ?? false,
      allowSkipOptionalWithNote: dto.completion_rules?.allow_skip_optional_with_note ?? false,
      resolutionLogFromSteps: dto.completion_rules?.resolution_log_from_steps ?? false,
    },
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    createdBy: dto.created_by,
  };
}

export function useTemplateList() {
  return useQuery({
    queryKey: templateKeys.list(),
    queryFn: async () => {
      const res = await listTemplates({ per_page: 100 });
      return (res.data?.templates ?? []).map(mapTemplate);
    },
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useTemplateDetail(id: string) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: async () => {
      const res = await getTemplate(id);
      if (!res.data) return null;
      return mapTemplate(res.data);
    },
    enabled: !!id,
    retry: false,
    meta: { suppressGlobalError: true },
  });
}

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChecklistTemplatePayload) => createTemplate(payload),
    onSuccess: () => {
      toast.success("Template created");
      qc.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: () => toast.error("Failed to create template"),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ChecklistTemplatePayload> }) =>
      updateTemplate(id, payload),
    onSuccess: () => {
      toast.success("Template saved");
      qc.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: () => toast.error("Failed to save template"),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTemplate(id),
    onSuccess: () => {
      toast.success("Template archived");
      qc.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: () => toast.error("Failed to archive template"),
  });
}

export function usePublishTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => publishTemplate(id),
    onSuccess: () => {
      toast.success("Template published");
      qc.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: () => toast.error("Failed to publish template"),
  });
}

export function useCloneTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cloneTemplate(id),
    onSuccess: () => {
      toast.success("Template cloned as draft");
      qc.invalidateQueries({ queryKey: templateKeys.all });
    },
    onError: () => toast.error("Failed to clone template"),
  });
}
