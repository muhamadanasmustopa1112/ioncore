"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiInformationLine,
  RiShieldCheckLine,
  RiSettings3Line,
} from "@remixicon/react";
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
import { Switch } from "@/components/ui/switch";
import { serviceFormSchema, type ServiceFormValues } from "../../../types/service-schema";
import { useSchemaStore } from "../../../store/schema";
import { useCreateSchema, useEditSchema, useSchema, useSchemaVersions } from "../../../api/schema-queries";
import { useActiveCustomerTypes } from "@/features/administration/customer-types/api/customer-types-queries";
import { useUpdateCustomerSchema } from "@/features/rule-schema";
import { DiffWrap, OverrideDiffProvider } from "../override-diff";
import { computeOverrideChanges } from "../../../utils/override-changes";

const DEFAULT_SERVICE: ServiceFormValues = {
  name: "",
  customer_type: "broadband",
  sla_uptime: 99.0,
  sla_response_hours: 8,
  sla_resolution_hours: 24,
  bandwidth_type: "best_effort",
  contention_ratio: "1:8",
  support_tier: "standard",
  maintenance_allowed: true,
  maintenance_schedule: "weekdays_02:00-06:00",
};

export function ServiceForm() {
  const { form, activeSchemaType, selectedSchemaId, setFormSubmitter, overrideCustomerSchema, closeSchemaSheet, openOverrideConfirm, overrideConfirmTrigger } = useSchemaStore();
  const isDetailMode = form === "details";
  const isOverride = form === "override";
  const createSchema = useCreateSchema();
  const editSchema = useEditSchema();
  const updateCustomerSchema = useUpdateCustomerSchema();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: DEFAULT_SERVICE,
  });

  const bandwidthType = watch("bandwidth_type");
  const maintenanceAllowed = watch("maintenance_allowed");

  const { data: schemaDetail } = useSchema((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);
  const { data: schemaVersions } = useSchemaVersions((form === "edit" || form === "details" || form === "clone") ? selectedSchemaId : null);
  const { data: customerTypes = [] } = useActiveCustomerTypes();

  function fromApiContent(c: Record<string, unknown>): Partial<ServiceFormValues> {
    const sla = (c.sla ?? {}) as Record<string, unknown>;
    const bp = (c.bandwidth_profile ?? {}) as Record<string, unknown>;
    const mw = (c.maintenance_window ?? {}) as Record<string, unknown>;
    return {
      sla_uptime: sla.uptime_guarantee_percentage as number,
      sla_response_hours: sla.response_time_hours as number,
      sla_resolution_hours: sla.resolution_time_hours as number,
      bandwidth_type: bp.type as ServiceFormValues["bandwidth_type"],
      contention_ratio: bp.contention_ratio as ServiceFormValues["contention_ratio"],
      support_tier: c.support_tier as ServiceFormValues["support_tier"],
      maintenance_allowed: mw.allowed as boolean,
      maintenance_schedule: mw.schedule as string,
    };
  }

  useEffect(() => {
    if ((form !== "edit" && form !== "details" && form !== "clone") || !schemaDetail) return;
    const latestVer = schemaVersions?.find((v) => v.version === schemaDetail.latest_version) ?? schemaVersions?.[0];
    const raw = (latestVer?.content ?? {}) as Record<string, unknown>;
    const content = fromApiContent(raw);
    reset({
      ...DEFAULT_SERVICE,
      name: form === "clone" ? `Copy of ${schemaDetail.name}` : schemaDetail.name,
      customer_type: schemaDetail.customer_type as ServiceFormValues["customer_type"],
      ...content,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, schemaDetail, schemaVersions]);

  const [overrideSnapshot, setOverrideSnapshot] = useState<ServiceFormValues>(DEFAULT_SERVICE);
  const pendingOverrideContent = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!isOverride || !overrideCustomerSchema) return;
    const partial = fromApiContent(overrideCustomerSchema.overridden_content);
    const cleaned = Object.fromEntries(Object.entries(partial).filter(([, v]) => v !== undefined)) as Partial<ServiceFormValues>;
    const vals: ServiceFormValues = { ...DEFAULT_SERVICE, ...cleaned, name: overrideCustomerSchema.schema_name ?? "_override" };
    reset(vals);
    setOverrideSnapshot(vals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOverride, overrideCustomerSchema?.id]);

  function toApiContent(values: ServiceFormValues) {
    return {
      sla: {
        uptime_guarantee_percentage: values.sla_uptime,
        response_time_hours: values.sla_response_hours,
        resolution_time_hours: values.sla_resolution_hours,
      },
      bandwidth_profile: {
        type: values.bandwidth_type,
        contention_ratio: values.contention_ratio,
      },
      support_tier: values.support_tier,
      maintenance_window: {
        allowed: values.maintenance_allowed,
        schedule: values.maintenance_schedule ?? "",
      },
    };
  }

  function onSubmit(values: ServiceFormValues) {
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
        <div className="space-y-8 pb-6">

          {!isOverride && (
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
                    placeholder="e.g. Residential Service Schema"
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
                      setValue("customer_type", v as ServiceFormValues["customer_type"])
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
              </div>
            </div>
          )}

          {/* Section 2: SLA */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiShieldCheckLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">SLA</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DiffWrap name="sla_uptime">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Uptime Guarantee (%)</Label>
                  <Input
                    type="number"
                    min={90}
                    max={100}
                    step={0.1}
                    disabled={isDetailMode}
                    {...register("sla_uptime", { valueAsNumber: true })}
                  />
                  {errors.sla_uptime && (
                    <p className="text-xs text-red-500">{errors.sla_uptime.message}</p>
                  )}
                </div>
              </DiffWrap>
              <DiffWrap name="sla_response_hours">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Response Time Hours</Label>
                  <Input
                    type="number"
                    min={1}
                    disabled={isDetailMode}
                    {...register("sla_response_hours", { valueAsNumber: true })}
                  />
                  {errors.sla_response_hours && (
                    <p className="text-xs text-red-500">{errors.sla_response_hours.message}</p>
                  )}
                </div>
              </DiffWrap>
              <DiffWrap name="sla_resolution_hours">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Resolution Time Hours</Label>
                  <Input
                    type="number"
                    min={1}
                    disabled={isDetailMode}
                    {...register("sla_resolution_hours", { valueAsNumber: true })}
                  />
                  {errors.sla_resolution_hours && (
                    <p className="text-xs text-red-500">{errors.sla_resolution_hours.message}</p>
                  )}
                </div>
              </DiffWrap>
            </div>
          </div>

          {/* Section 3: Service Config */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiSettings3Line className="size-4 text-purple-500" />
              <h3 className="text-sm font-semibold">Service Config</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Bandwidth Type</Label>
                <Select
                  value={bandwidthType}
                  onValueChange={(v) =>
                    setValue("bandwidth_type", v as ServiceFormValues["bandwidth_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best_effort">Best Effort</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                    <SelectItem value="guaranteed_minimum">Guaranteed Minimum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {bandwidthType !== "best_effort" && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Contention Ratio</Label>
                  <Select
                    value={watch("contention_ratio")}
                    onValueChange={(v) =>
                      setValue("contention_ratio", v as ServiceFormValues["contention_ratio"])
                    }
                    disabled={isDetailMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1</SelectItem>
                      <SelectItem value="1:4">1:4</SelectItem>
                      <SelectItem value="1:8">1:8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Support Tier</Label>
                <Select
                  value={watch("support_tier")}
                  onValueChange={(v) =>
                    setValue("support_tier", v as ServiceFormValues["support_tier"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between md:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">Maintenance Allowed</Label>
                <Switch
                  size="lg"
                  checked={maintenanceAllowed}
                  onCheckedChange={(v) => setValue("maintenance_allowed", v)}
                  disabled={isDetailMode}
                />
              </div>
              {maintenanceAllowed && (
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Maintenance Schedule
                  </Label>
                  <Input
                    placeholder="e.g. weekdays_02:00-06:00"
                    disabled={isDetailMode}
                    {...register("maintenance_schedule")}
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
    </OverrideDiffProvider>
  );
}
