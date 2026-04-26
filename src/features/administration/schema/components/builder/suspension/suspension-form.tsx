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
import { suspensionFormSchema, type SuspensionFormValues } from "../../../types/suspension-schema";
import { useSchemaStore } from "../../../store/schema";
import { useCreateSchema, useUpdateSchemaContent, useSchema, useSchemaVersions } from "../../../api/schema-queries";
import { SuspensionRulesSection } from "./suspension-rules-section";
import { RestorationTerminationSection } from "./restoration-termination-section";

const DEFAULT_SUSPENSION: SuspensionFormValues = {
  name: "",
  customer_type: "residential",
  suspension_automatic: true,
  suspension_trigger: "after_grace_period",
  suspension_requires_manual_approval: false,
  suspension_requires_executive_approval: false,
  suspension_ion_radius_action: "full_block",
  suspension_throttle_speed_kbps: 512,
  suspension_notification: true,
  suspension_notification_channels: ["whatsapp"],
  restoration_automatic: true,
  restoration_trigger: "on_payment_confirmed",
  restoration_requires_manual_trigger: false,
  restoration_requires_approval: false,
  termination_enabled: false,
  termination_trigger_basis: "days_after_suspension",
  termination_days: 30,
  termination_notify_customer_days_before: 7,
  termination_auto_create_wo: true,
  termination_requires_approval: false,
};

export function SuspensionForm() {
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter } = useSchemaStore();
  const isDetailMode = form === "details";
  const createSchema = useCreateSchema();
  const updateSchema = useUpdateSchemaContent();

  const rhfForm = useForm<SuspensionFormValues>({
    resolver: zodResolver(suspensionFormSchema),
    defaultValues: DEFAULT_SUSPENSION,
  });

  const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = rhfForm;

  const { data: schemaDetail } = useSchema((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);
  const { data: schemaVersions } = useSchemaVersions((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);

  function fromApiContent(c: Record<string, unknown>): Partial<SuspensionFormValues> {
    const s = (c.suspension ?? {}) as Record<string, unknown>;
    const r = (c.restoration ?? {}) as Record<string, unknown>;
    const t = (c.termination_trigger ?? {}) as Record<string, unknown>;
    return {
      suspension_automatic: s.automatic as boolean,
      suspension_trigger: s.trigger as SuspensionFormValues["suspension_trigger"],
      suspension_requires_manual_approval: s.requires_manual_approval as boolean,
      suspension_requires_executive_approval: s.requires_executive_approval as boolean,
      suspension_ion_radius_action: s.ion_radius_action as SuspensionFormValues["suspension_ion_radius_action"],
      suspension_throttle_speed_kbps: s.throttle_speed_kbps as number,
      suspension_notification: s.notification as boolean,
      suspension_notification_channels: s.notification_channels as string[],
      restoration_automatic: r.automatic as boolean,
      restoration_trigger: r.trigger as SuspensionFormValues["restoration_trigger"],
      restoration_requires_manual_trigger: r.requires_manual_trigger as boolean,
      restoration_requires_approval: r.requires_approval as boolean,
      termination_enabled: t.enabled as boolean,
      termination_trigger_basis: t.trigger_basis as SuspensionFormValues["termination_trigger_basis"],
      termination_days: t.days as number,
      termination_notify_customer_days_before: t.notify_customer_days_before as number,
      termination_auto_create_wo: t.auto_create_wo as boolean,
      termination_requires_approval: t.requires_approval as boolean,
    };
  }

  useEffect(() => {
    if ((form !== "edit" && form !== "details" && form !== "clone") || !schemaDetail) return;
    const latestVer = schemaVersions?.find((v) => v.version === schemaDetail.latest_version) ?? schemaVersions?.[0];
    const raw = (latestVer?.content ?? {}) as Record<string, unknown>;
    const content = fromApiContent(raw);
    reset({
      ...DEFAULT_SUSPENSION,
      name: form === "clone" ? `Copy of ${schemaDetail.name}` : schemaDetail.name,
      customer_type: schemaDetail.customer_type as SuspensionFormValues["customer_type"],
      ...content,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, schemaDetail, schemaVersions]);

  function toApiContent(values: SuspensionFormValues) {
    return {
      suspension: {
        automatic: values.suspension_automatic,
        trigger: values.suspension_trigger,
        requires_manual_approval: values.suspension_requires_manual_approval,
        requires_executive_approval: values.suspension_requires_executive_approval,
        ion_radius_action: values.suspension_ion_radius_action,
        throttle_speed_kbps: values.suspension_throttle_speed_kbps ?? 512,
        notification: values.suspension_notification,
        notification_channels: values.suspension_notification_channels,
      },
      restoration: {
        automatic: values.restoration_automatic,
        trigger: values.restoration_trigger,
        requires_manual_trigger: values.restoration_requires_manual_trigger,
        requires_approval: values.restoration_requires_approval,
        ion_radius_action: "restore",
      },
      termination_trigger: {
        enabled: values.termination_enabled,
        trigger_basis: values.termination_trigger_basis ?? "days_after_suspension",
        days: values.termination_days ?? 30,
        waive_early_termination_penalty: true,
        notify_customer_days_before: values.termination_notify_customer_days_before ?? 7,
        auto_create_wo: values.termination_auto_create_wo ?? true,
        requires_approval: values.termination_requires_approval ?? false,
        notify_internal: ["finance", "ops_admin"],
      },
    };
  }

  function onSubmit(values: SuspensionFormValues) {
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
                  placeholder="e.g. Residential Suspension Schema"
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
                    setValue("customer_type", v as SuspensionFormValues["customer_type"])
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
            </div>
          </div>

          <SuspensionRulesSection form={rhfForm} disabled={isDetailMode} />

          <RestorationTerminationSection form={rhfForm} disabled={isDetailMode} />

        </div>
      </ScrollArea>
    </div>
  );
}
