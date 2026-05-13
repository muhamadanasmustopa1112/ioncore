"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BroadbandPlan, CreateBroadbandPlanPayload } from "../../types/products";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  speed_download_mbps: z.number({ error: "Required" }).min(1, "Required"),
  speed_upload_mbps: z.number({ error: "Required" }).min(1, "Required"),
  price: z.number({ error: "Required" }).min(0, "Required"),
  one_time_charge: z.number({ error: "Required" }).min(0, "Required"),
  customer_type: z.enum(["broadband", "business", "both"]),
  temporary_activation_window_hours: z.number({ error: "Required" }).min(0, "Required"),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface PlanFormProps {
  selected: BroadbandPlan | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateBroadbandPlanPayload) => void;
}

export function PlanForm({ selected, mode, onSubmit }: PlanFormProps) {
  const isDetail = mode === "details";

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", speed_download_mbps: 0, speed_upload_mbps: 0,
      price: 0, one_time_charge: 0, customer_type: "broadband",
      temporary_activation_window_hours: 24, is_active: true,
    },
  });

  useEffect(() => {
    if (selected && (mode === "edit" || mode === "details")) {
      reset({
        name: selected.name,
        speed_download_mbps: selected.speed_download_mbps,
        speed_upload_mbps: selected.speed_upload_mbps,
        price: selected.price,
        one_time_charge: selected.one_time_charge,
        customer_type: selected.customer_type,
        temporary_activation_window_hours: selected.temporary_activation_window_hours,
        is_active: selected.is_active,
      });
    } else if (!selected && mode === "new") {
      reset({ name: "", speed_download_mbps: 0, speed_upload_mbps: 0, price: 0, one_time_charge: 0, customer_type: "broadband", temporary_activation_window_hours: 24, is_active: true });
    }
  }, [selected, mode, reset]);

  const submitRef = useRef<(() => void) | undefined>(undefined);
  submitRef.current = handleSubmit((v) => onSubmit(v));

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
        <Field label="Plan Name" required error={errors.name?.message}>
          <Input placeholder="e.g. Home 100 Mbps" {...register("name")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Download Speed (Mbps)" required error={errors.speed_download_mbps?.message}>
            <Input type="number" {...register("speed_download_mbps", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
          <Field label="Upload Speed (Mbps)" required error={errors.speed_upload_mbps?.message}>
            <Input type="number" {...register("speed_upload_mbps", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Monthly Price (IDR)" required error={errors.price?.message}>
            <Input type="number" {...register("price", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
          <Field label="One-Time Charge (IDR)" required error={errors.one_time_charge?.message}>
            <Input type="number" {...register("one_time_charge", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Customer Type" required error={errors.customer_type?.message}>
            <Controller name="customer_type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="broadband">Broadband</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            )} />
          </Field>
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

        <Field label="Temp Activation Window (hours)" required error={errors.temporary_activation_window_hours?.message}>
          <Input type="number" {...register("temporary_activation_window_hours", { valueAsNumber: true })} disabled={isDetail} />
        </Field>


      </div>
    </ScrollArea>
  );
}
