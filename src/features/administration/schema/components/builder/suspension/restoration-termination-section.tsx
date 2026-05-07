"use client";

import { UseFormReturn } from "react-hook-form";
import { RiRefreshLine, RiDeleteBinLine } from "@remixicon/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type SuspensionFormValues } from "../../../types/suspension-schema";

interface RestorationTerminationSectionProps {
  form: UseFormReturn<SuspensionFormValues>;
  disabled: boolean;
}

export function RestorationTerminationSection({ form, disabled }: RestorationTerminationSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const restorationAutomatic = watch("restoration_automatic");
  const terminationEnabled = watch("termination_enabled");

  return (
    <>
      {/* Section 3: Restoration */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <RiRefreshLine className="size-4 text-green-500" />
          <h3 className="text-sm font-semibold">Restoration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Auto Restore</Label>
            <Switch
              size="lg"
              checked={restorationAutomatic}
              onCheckedChange={(v) => setValue("restoration_automatic", v)}
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Trigger</Label>
            <Select
              value={watch("restoration_trigger")}
              onValueChange={(v) =>
                setValue("restoration_trigger", v as SuspensionFormValues["restoration_trigger"])
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on_payment_confirmed">On Payment Confirmed</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Requires Manual Trigger</Label>
            <Switch
              size="lg"
              checked={watch("restoration_requires_manual_trigger")}
              onCheckedChange={(v) => setValue("restoration_requires_manual_trigger", v)}
              disabled={disabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Requires Approval</Label>
            <Switch
              size="lg"
              checked={watch("restoration_requires_approval")}
              onCheckedChange={(v) => setValue("restoration_requires_approval", v)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Auto-Termination */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <RiDeleteBinLine className="size-4 text-orange-500" />
          <h3 className="text-sm font-semibold">Auto-Termination</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Termination Enabled</Label>
            <Switch
              size="lg"
              checked={terminationEnabled}
              onCheckedChange={(v) => setValue("termination_enabled", v)}
              disabled={disabled}
            />
          </div>
          {terminationEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Trigger Basis</Label>
                <Select
                  value={watch("termination_trigger_basis") ?? "days_after_suspension"}
                  onValueChange={(v) =>
                    setValue(
                      "termination_trigger_basis",
                      v as "days_after_invoice_due" | "days_after_suspension"
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days_after_invoice_due">Days After Invoice Due</SelectItem>
                    <SelectItem value="days_after_suspension">Days After Suspension</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Days</Label>
                <Input
                  type="number"
                  min={1}
                  disabled={disabled}
                  {...register("termination_days", { valueAsNumber: true })}
                />
                {errors.termination_days && (
                  <p className="text-xs text-red-500">{errors.termination_days.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Notify Customer Days Before
                </Label>
                <Input
                  type="number"
                  min={0}
                  disabled={disabled}
                  {...register("termination_notify_customer_days_before", { valueAsNumber: true })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Auto Create WO</Label>
                <Switch
                  size="lg"
                  checked={watch("termination_auto_create_wo") ?? false}
                  onCheckedChange={(v) => setValue("termination_auto_create_wo", v)}
                  disabled={disabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Requires Approval</Label>
                <Switch
                  size="lg"
                  checked={watch("termination_requires_approval") ?? false}
                  onCheckedChange={(v) => setValue("termination_requires_approval", v)}
                  disabled={disabled}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
