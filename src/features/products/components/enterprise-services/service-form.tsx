"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EnterpriseService, CreateEnterpriseServicePayload } from "../../types/products";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["connectivity", "security", "entertainment", "data_center", "managed", "infrastructure"]),
  delivery_type: z.enum(["ion_direct", "vendor_supplied", "hybrid"]),
  unit: z.enum(["monthly", "one_time", "per_unit", "per_m2", "per_rack"]),
  base_price: z.number({ error: "Required" }).min(0, "Required"),
  pricing_type: z.enum(["fixed", "negotiated", "vendor_quoted"]),
  sla_uptime: z.number({ error: "Required" }).min(0).max(100),
  sla_response: z.number({ error: "Required" }).min(0),
  sla_resolution: z.number({ error: "Required" }).min(0),
  is_wo_required: z.boolean(),
  wo_type: z.string().min(1, "Required"),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface ServiceFormProps {
  selected: EnterpriseService | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateEnterpriseServicePayload) => void;
}

export function ServiceForm({ selected, mode, onSubmit }: ServiceFormProps) {
  const isDetail = mode === "details";

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", category: "connectivity", delivery_type: "ion_direct", unit: "monthly",
      base_price: 0, pricing_type: "fixed", sla_uptime: 99.9, sla_response: 4, sla_resolution: 24,
      is_wo_required: false, wo_type: "", is_active: true,
    },
  });

  useEffect(() => {
    if (selected && (mode === "edit" || mode === "details")) {
      reset({
        name: selected.name,
        category: selected.category as FormValues["category"],
        delivery_type: selected.delivery_type as FormValues["delivery_type"],
        unit: (selected.unit ?? "monthly") as FormValues["unit"],
        base_price: selected.base_price,
        pricing_type: selected.pricing_type as FormValues["pricing_type"],
        sla_uptime: selected.sla_template.uptime_percentage,
        sla_response: selected.sla_template.response_time_hours,
        sla_resolution: selected.sla_template.resolution_time_hours,
        is_wo_required: selected.is_wo_required,
        wo_type: selected.wo_type,
        is_active: selected.is_active,
      });
    } else if (!selected && mode === "new") {
      reset({
        name: "", category: "connectivity", delivery_type: "ion_direct", unit: "monthly",
        base_price: 0, pricing_type: "fixed", sla_uptime: 99.9, sla_response: 4, sla_resolution: 24,
        is_wo_required: false, wo_type: "", is_active: true,
      });
    }
  }, [selected, mode, reset]);

  const submitRef = useRef<(() => void) | undefined>(undefined);
  submitRef.current = handleSubmit((v) => onSubmit({
    name: v.name, category: v.category, delivery_type: v.delivery_type, unit: v.unit,
    base_price: v.base_price, pricing_type: v.pricing_type, is_wo_required: v.is_wo_required,
    wo_type: v.wo_type, is_active: v.is_active,
    sla_template: { uptime_percentage: v.sla_uptime, response_time_hours: v.sla_response, resolution_time_hours: v.sla_resolution },
  }));

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__productFormSubmit = () => submitRef.current?.();
    return () => { delete (window as unknown as Record<string, unknown>).__productFormSubmit; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Field = ({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );

  return (
    <ScrollArea className="h-full px-6 py-5">
      <div className="space-y-4 pb-6">
        <Field label="Service Name" required error={errors.name?.message}>
          <Input placeholder="e.g. Dedicated Internet Access" {...register("name")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category" required>
            <Controller name="category" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="connectivity">Connectivity</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="data_center">Data Center</SelectItem>
                  <SelectItem value="managed">Managed</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
          <Field label="Delivery Type" required>
            <Controller name="delivery_type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ion_direct">ION Direct</SelectItem>
                  <SelectItem value="vendor_supplied">Vendor Supplied</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Base Price (IDR)" required error={errors.base_price?.message}>
            <Input type="number" {...register("base_price", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
          <Field label="Unit" required>
            <Controller name="unit" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="one_time">One Time</SelectItem>
                  <SelectItem value="per_unit">Per Unit</SelectItem>
                  <SelectItem value="per_m2">Per m²</SelectItem>
                  <SelectItem value="per_rack">Per Rack</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
          <Field label="Pricing Type" required>
            <Controller name="pricing_type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="negotiated">Negotiated</SelectItem>
                  <SelectItem value="vendor_quoted">Vendor Quoted</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
        </div>

        <div className="rounded-md border p-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">SLA Template</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Uptime %" required error={errors.sla_uptime?.message}>
              <Input type="number" step="0.1" {...register("sla_uptime", { valueAsNumber: true })} disabled={isDetail} />
            </Field>
            <Field label="Response (hrs)" required error={errors.sla_response?.message}>
              <Input type="number" {...register("sla_response", { valueAsNumber: true })} disabled={isDetail} />
            </Field>
            <Field label="Resolution (hrs)" required error={errors.sla_resolution?.message}>
              <Input type="number" {...register("sla_resolution", { valueAsNumber: true })} disabled={isDetail} />
            </Field>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="WO Required">
            <Controller name="is_wo_required" control={control} render={({ field }) => (
              <Select value={field.value ? "true" : "false"} onValueChange={(v) => field.onChange(v === "true")} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
          <Field label="WO Type" required error={errors.wo_type?.message}>
            <Input placeholder="e.g. installation" {...register("wo_type")} disabled={isDetail} />
          </Field>
        </div>

        <Field label="Status">
          <Controller name="is_active" control={control} render={({ field }) => (
            <Select value={field.value ? "true" : "false"} onValueChange={(v) => field.onChange(v === "true")} disabled={isDetail}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </Field>
      </div>
    </ScrollArea>
  );
}
