"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiInformationLine } from "@remixicon/react";
import { toast } from "sonner";
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
import { useCreateSchema, useEditSchema, useSchema, useSchemaVersions } from "../../../api/schema-queries";
import { useActiveCustomerTypes } from "@/features/administration/customer-types/api/customer-types-queries";
import { useUpdateCustomerSchema } from "@/features/rule-schema";
import { DiffWrap, OverrideDiffProvider } from "../override-diff";
import { computeOverrideChanges } from "../../../utils/override-changes";
import { StepsSection } from "./steps-section";
import { DocumentsSection } from "./documents-section";

const DEFAULT_ONBOARDING: OnboardingFormValues = {
  name: "",
  customer_type: "broadband",
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
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter, setSheetLoading, overrideCustomerSchema, closeSchemaSheet, openOverrideConfirm, overrideConfirmTrigger } = useSchemaStore();
  const isDetailMode = form === "details" || form === "view_override";
  const isOverride = form === "override" || form === "view_override";
  const createSchema = useCreateSchema();
  const editSchema = useEditSchema();
  const updateCustomerSchema = useUpdateCustomerSchema();

  const rhfForm = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: DEFAULT_ONBOARDING,
  });

  const { register, watch, setValue, handleSubmit, reset, getValues, formState: { errors } } = rhfForm;

  const needsData = form === "edit" || form === "details" || form === "clone";
  const { data: schemaDetail, isLoading: isSchemaLoading } = useSchema(needsData ? selectedSchemaId : null);
  const { data: schemaVersions, isLoading: isVersionsLoading } = useSchemaVersions(needsData ? selectedSchemaId : null);
  const isLoadingData = needsData && (isSchemaLoading || isVersionsLoading);
  const { data: customerTypes = [] } = useActiveCustomerTypes();

  useEffect(() => {
    setSheetLoading(isLoadingData);
    return () => setSheetLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingData]);

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

  const [overrideSnapshot, setOverrideSnapshot] = useState<OnboardingFormValues>(DEFAULT_ONBOARDING);
  const pendingOverrideContent = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!isOverride || !overrideCustomerSchema) return;
    const partial = fromApiContent(overrideCustomerSchema.overridden_content);
    const cleaned = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined)) as Partial<OnboardingFormValues>;
    const vals: OnboardingFormValues = { ...DEFAULT_ONBOARDING, ...cleaned, name: overrideCustomerSchema.schema_name ?? "_override" };
    reset(vals);
    setOverrideSnapshot(vals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverride, overrideCustomerSchema?.id]);

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
      editSchema.mutate({
        id: selectedSchemaId,
        name,
        customer_type,
        originalName: schemaDetail?.name ?? "",
        originalCustomerType: schemaDetail?.customer_type ?? "",
        content,
      });
    } else if (isOverride && overrideCustomerSchema) {
      updateCustomerSchema.mutate(
        { id: overrideCustomerSchema.id, payload: { overridden_content: content as unknown as Record<string, unknown> } },
        {
          onSuccess: () => { toast.success("Schema override saved"); closeSchemaSheet(); },
          onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to save override"),
        },
      );
    }
  }

  useEffect(() => {
    if (isOverride) {
      setFormSubmitter(() => {
        const current = getValues();
        const changes = computeOverrideChanges(overrideSnapshot, current);
        pendingOverrideContent.current = toApiContent(current) as unknown as Record<string, unknown>;
        openOverrideConfirm(changes);
      });
    } else {
      setFormSubmitter(handleSubmit(onSubmit));
    }
    return () => setFormSubmitter(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, selectedSchemaId, isOverride, overrideSnapshot]);

  useEffect(() => {
    if (!isOverride || overrideConfirmTrigger === 0 || !pendingOverrideContent.current || !overrideCustomerSchema) return;
    updateCustomerSchema.mutate(
      { id: overrideCustomerSchema.id, payload: { overridden_content: pendingOverrideContent.current } },
      {
        onSuccess: () => { toast.success("Schema override saved"); closeSchemaSheet(); },
        onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Failed to save override"),
      },
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overrideConfirmTrigger]);

  const allValues = watch();

  return (
    <OverrideDiffProvider
      enabled={isOverride}
      originalValues={overrideSnapshot as unknown as Record<string, unknown>}
      currentValues={allValues as unknown as Record<string, unknown>}
    >
    <div className="flex h-full flex-col overflow-hidden">
      <ScrollArea className="flex-1 px-6 py-6">
        {isLoadingData ? (
          <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
            <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
            Loading schema...
          </div>
        ) : (
        <div className="space-y-8 pb-6">

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiInformationLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">{isOverride ? "Timing" : "Basic Info"}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!isOverride && (
                <>
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
                        {customerTypes.map((ct) => (
                          <SelectItem key={ct.id} value={ct.name}>{ct.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <DiffWrap name="expected_duration_hours">
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
              </DiffWrap>
              <DiffWrap name="sla_hours">
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
              </DiffWrap>
            </div>
          </div>

          <StepsSection form={rhfForm} disabled={isDetailMode} />

          <DocumentsSection form={rhfForm} disabled={isDetailMode} />

        </div>
        )}
      </ScrollArea>
    </div>
    </OverrideDiffProvider>
  );
}
