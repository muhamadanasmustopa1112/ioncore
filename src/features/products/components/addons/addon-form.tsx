"use client";

import { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Addon, CreateAddonPayload } from "../../types/products";
import { useAdminBroadbandPlans } from "../../api/products-queries";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["digital", "physical", "service"]),
  price: z.number({ error: "Required" }).min(0, "Required"),
  one_time_charge: z.number({ error: "Required" }).min(0, "Required"),
  profile_change_id: z.string().optional(),
  broadband_plan_ids: z.array(z.string()).optional(),
  is_wo_required: z.boolean(),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface AddonFormProps {
  selected: Addon | null;
  mode: "new" | "edit" | "details";
  onSubmit: (payload: CreateAddonPayload) => void;
}

export function AddonForm({ selected, mode, onSubmit }: AddonFormProps) {
  const isDetail = mode === "details";
  const { data: plansData } = useAdminBroadbandPlans();
  const plans = plansData?.broadband_plans ?? [];

  const { register, handleSubmit, control, reset, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", type: "digital", price: 0, one_time_charge: 0, profile_change_id: "", broadband_plan_ids: [], is_wo_required: false, is_active: true },
  });

  useEffect(() => {
    if (selected && (mode === "edit" || mode === "details")) {
      reset({
        name: selected.name, type: selected.type, price: selected.price,
        one_time_charge: selected.one_time_charge, profile_change_id: selected.profile_change_id ?? "",
        broadband_plan_ids: selected.broadband_plans?.map((p) => p.id) ?? [],
        is_wo_required: selected.is_wo_required, is_active: selected.is_active,
      });
    } else if (!selected && mode === "new") {
      reset({ name: "", type: "digital", price: 0, one_time_charge: 0, profile_change_id: "", broadband_plan_ids: [], is_wo_required: false, is_active: true });
    }
  }, [selected, mode, reset]);

  const submitRef = useRef<(() => void) | undefined>(undefined);
  submitRef.current = handleSubmit((v) => onSubmit({
    ...v,
    profile_change_id: v.profile_change_id || undefined,
    broadband_plan_ids: v.broadband_plan_ids?.length ? v.broadband_plan_ids : undefined,
  }));

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__productFormSubmit = () => submitRef.current?.();
    return () => { delete (window as unknown as Record<string, unknown>).__productFormSubmit; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const broadbandPlanIds = watch("broadband_plan_ids") ?? [];

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
        <Field label="Add-on Name" required error={errors.name?.message}>
          <Input placeholder="e.g. Static IP" {...register("name")} disabled={isDetail} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Type" required error={errors.type?.message}>
            <Controller name="type" control={control} render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={isDetail}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
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

        <div className="grid grid-cols-2 gap-4">
          <Field label="Monthly Price (IDR)" required error={errors.price?.message}>
            <Input type="number" {...register("price", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
          <Field label="One-Time Charge (IDR)" required error={errors.one_time_charge?.message}>
            <Input type="number" {...register("one_time_charge", { valueAsNumber: true })} disabled={isDetail} />
          </Field>
        </div>

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

        <Field label="Profile Change ID">
          <Input placeholder="Optional" {...register("profile_change_id")} disabled={isDetail} />
        </Field>

        {/* Compatible Plans */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Compatible Plans</Label>
          {plans.length === 0 ? (
            <p className="text-xs text-muted-foreground">No plans available</p>
          ) : (
            <Controller
              name="broadband_plan_ids"
              control={control}
              render={({ field }) => (
                <div className="rounded-md border divide-y max-h-48 overflow-y-auto">
                  {plans.map((plan) => {
                    const checked = (field.value ?? []).includes(plan.id);
                    return (
                      <label
                        key={plan.id}
                        className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors ${isDetail ? "pointer-events-none" : ""}`}
                      >
                        <Checkbox
                          checked={checked}
                          disabled={isDetail}
                          onCheckedChange={(v) => {
                            const next = v
                              ? [...(field.value ?? []), plan.id]
                              : (field.value ?? []).filter((id) => id !== plan.id);
                            field.onChange(next);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{plan.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {plan.speed_download_mbps}/{plan.speed_upload_mbps} Mbps · {plan.customer_type}
                          </p>
                        </div>
                        {checked && (
                          <span className="text-xs font-semibold text-emerald-600 shrink-0">Selected</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          )}
          {broadbandPlanIds.length > 0 && (
            <p className="text-xs text-muted-foreground">{broadbandPlanIds.length} plan{broadbandPlanIds.length > 1 ? "s" : ""} selected</p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
