"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiInformationLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onboardingFormSchema, type OnboardingFormValues } from "../../../types/onboarding-schema";
import { useSchemaStore } from "../../../store/schema";
import { useCreateSchema, useUpdateSchemaContent, useSchema, useSchemaVersions } from "../../../api/schema-queries";
import { StepsSection } from "./steps-section";
import { DocumentsSection } from "./documents-section";

const DEFAULT_ONBOARDING: OnboardingFormValues = {
  name: "",
  customer_type: "residential",
  steps: [
    {
      step_id: 1,
      step_name: "Lead Verification",
      required: true,
      automated: false,
      work_order_type: "",
      priority: "high",
      equipment_template: "",
      requires_approval: false,
      approval_workflow: "sequential",
    },
  ],
  expected_duration_hours: 48,
  sla_hours: 72,
  required_documents: [
    {
      document_id: "doc-ktp",
      document_name: "KTP",
      required: true,
      description: "Kartu Tanda Penduduk",
      accepted_formats: ["jpg", "png", "pdf"],
      max_size_mb: 5,
      validation: "manual",
    },
  ],
};

export function OnboardingForm() {
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter } = useSchemaStore();
  const isDetailMode = form === "details";
  const createSchema = useCreateSchema();
  const updateSchema = useUpdateSchemaContent();

  const rhfForm = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: DEFAULT_ONBOARDING,
  });

  const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = rhfForm;

  const { data: schemaDetail } = useSchema((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);
  const { data: schemaVersions } = useSchemaVersions((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);

  function fromApiContent(c: Record<string, unknown>): Partial<OnboardingFormValues> {
    const timeline = (c.timeline ?? {}) as Record<string, unknown>;
    return {
      steps: c.steps as OnboardingFormValues["steps"],
      expected_duration_hours: timeline.expected_duration_hours as number,
      sla_hours: timeline.sla_hours as number,
      required_documents: c.required_documents as OnboardingFormValues["required_documents"],
    };
  }

  useEffect(() => {
    if ((form !== "edit" && form !== "details" && form !== "clone") || !schemaDetail) return;
    const latestVer = schemaVersions?.find((v) => v.version === schemaDetail.latest_version) ?? schemaVersions?.[0];
    const raw = (latestVer?.content ?? {}) as Record<string, unknown>;
    const content = fromApiContent(raw);
    reset({
      ...DEFAULT_ONBOARDING,
      name: form === "clone" ? `Copy of ${schemaDetail.name}` : schemaDetail.name,
      customer_type: schemaDetail.customer_type as OnboardingFormValues["customer_type"],
      ...content,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, schemaDetail, schemaVersions]);

  function toApiContent(values: OnboardingFormValues) {
    return {
      steps: values.steps.map((step) => ({
        step_id: step.step_id,
        step_name: step.step_name,
        required: step.required,
        automated: step.automated,
        work_order_type: step.work_order_type,
        priority: step.priority,
        equipment_template: step.equipment_template,
        requires_approval: step.requires_approval,
        approval_workflow: step.approval_workflow,
        validation_rules: [],
        logic: "",
        approvers: [],
        notifications: [],
      })),
      timeline: {
        expected_duration_hours: values.expected_duration_hours,
        sla_hours: values.sla_hours,
      },
      required_documents: values.required_documents.map((doc) => ({
        document_id: doc.document_id,
        document_name: doc.document_name,
        required: doc.required,
        description: doc.description,
        accepted_formats: doc.accepted_formats,
        max_size_mb: doc.max_size_mb,
        validation: doc.validation,
        validation_rules: [],
      })),
      additional_approvals: [],
    };
  }

  function onSubmit(values: OnboardingFormValues) {
    const { name, customer_type } = values;
    const content = toApiContent(values);
    if (form === "new" || form === "clone") {
      createSchema.mutate({ schema_type: activeSchemaType, name, customer_type, content });
    } else if (form === "edit" && selectedSchemaId) {
      updateSchema.mutate({ id: selectedSchemaId, payload: { content } });
    }
  }

  useEffect(() => {
    setFormSubmitter(handleSubmit(onSubmit));
    return () => setFormSubmitter(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, selectedSchemaId]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        <div className="space-y-8 pb-6">

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Basic Info</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Schema Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Residential Onboarding Schema"
                  disabled={isDetailMode}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Customer Type</Label>
                <Select
                  value={watch("customer_type")}
                  onValueChange={(v) =>
                    setValue("customer_type", v as OnboardingFormValues["customer_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Expected Duration (Hours)</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={isDetailMode}
                  {...register("expected_duration_hours", { valueAsNumber: true })}
                />
                {errors.expected_duration_hours && (
                  <p className="text-xs text-red-500">{errors.expected_duration_hours.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">SLA Hours</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={isDetailMode}
                  {...register("sla_hours", { valueAsNumber: true })}
                />
                {errors.sla_hours && (
                  <p className="text-xs text-red-500">{errors.sla_hours.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Onboarding Steps */}
          <StepsSection form={rhfForm} disabled={isDetailMode} />

          {/* Section 3: Required Documents */}
          <DocumentsSection form={rhfForm} disabled={isDetailMode} />

        </div>
      </ScrollArea>
    </div>
  );
}
