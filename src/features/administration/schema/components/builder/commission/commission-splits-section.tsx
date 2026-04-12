"use client";

import { UseFormReturn } from "react-hook-form";
import { RiGroupLine, RiRepeatLine } from "@remixicon/react";
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
import { type CommissionFormValues } from "../../../types/commission-schema";

interface CommissionSplitsSectionProps {
  form: UseFormReturn<CommissionFormValues>;
  disabled: boolean;
}

export function CommissionSplitsSection({ form, disabled }: CommissionSplitsSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const salesManagerEnabled = watch("assignment.sales_manager_enabled");
  const infraBranchEnabled = watch("assignment.infrastructure_branch_enabled");

  const salesPerson = watch("assignment.sales_person") ?? 0;
  const salesManagerPct = watch("assignment.sales_manager_percentage") ?? 0;
  const salesBranch = watch("assignment.sales_branch") ?? 0;
  const infraPct = watch("assignment.infrastructure_branch_percentage") ?? 0;

  const companyRemainder =
    100 -
    salesPerson -
    (salesManagerEnabled ? salesManagerPct : 0) -
    salesBranch -
    (infraBranchEnabled ? infraPct : 0);

  return (
    <>
      {/* Section 3: Commission Splits */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <RiGroupLine className="size-4 text-purple-500" />
          <h3 className="text-sm font-semibold">Commission Splits</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Sales Person (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              disabled={disabled}
              {...register("assignment.sales_person", { valueAsNumber: true })}
            />
            {errors.assignment?.sales_person && (
              <p className="text-xs text-red-500">{errors.assignment.sales_person.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Sales Manager Enabled</Label>
            <Switch
              size="sm"
              checked={salesManagerEnabled}
              onCheckedChange={(v) => setValue("assignment.sales_manager_enabled", v)}
              disabled={disabled}
            />
          </div>
          {salesManagerEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Manager Percentage (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  disabled={disabled}
                  {...register("assignment.sales_manager_percentage", { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Manager Level</Label>
                <Select
                  value={watch("assignment.sales_manager_level")}
                  onValueChange={(v) =>
                    setValue(
                      "assignment.sales_manager_level",
                      v as "direct_manager" | "direct_manager+area_manager"
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct_manager">Direct Manager</SelectItem>
                    <SelectItem value="direct_manager+area_manager">Direct + Area Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">Sales Branch (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              disabled={disabled}
              {...register("assignment.sales_branch", { valueAsNumber: true })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Infrastructure Branch Enabled</Label>
            <Switch
              size="sm"
              checked={infraBranchEnabled}
              onCheckedChange={(v) => setValue("assignment.infrastructure_branch_enabled", v)}
              disabled={disabled}
            />
          </div>
          {infraBranchEnabled && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Infrastructure Branch (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                disabled={disabled}
                {...register("assignment.infrastructure_branch_percentage", { valueAsNumber: true })}
              />
            </div>
          )}
          <div className="md:col-span-2 p-3 rounded-md bg-muted/50 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Company (Remainder)</span>
              <span
                className={`text-sm font-semibold ${
                  companyRemainder < 0 ? "text-red-500" : "text-green-600"
                }`}
              >
                {companyRemainder.toFixed(1)}%
              </span>
            </div>
            {companyRemainder < 0 && (
              <p className="text-xs text-red-500 mt-1">Total commission splits exceed 100%</p>
            )}
          </div>
          {errors.assignment && "message" in errors.assignment && (
            <p className="text-xs text-red-500 md:col-span-2">
              {(errors.assignment as { message?: string }).message}
            </p>
          )}
        </div>
      </div>

      {/* Section: Recurring Commission */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <RiRepeatLine className="size-4 text-blue-400" />
          <h3 className="text-sm font-semibold">Recurring Commission</h3>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border/50 p-3">
          <div>
            <p className="text-sm font-medium">Enable Recurring Commission</p>
            <p className="text-xs text-muted-foreground">Komisi berulang per periode billing</p>
          </div>
          <Switch
            checked={watch("recurring_enabled")}
            onCheckedChange={(v) => setValue("recurring_enabled", v)}
            disabled={disabled}
          />
        </div>
        {watch("recurring_enabled") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Type</Label>
              <Select
                value={watch("recurring_type") ?? "percentage"}
                onValueChange={(v) => setValue("recurring_type", v as "percentage" | "fixed_amount")}
                disabled={disabled}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount (IDR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {watch("recurring_type") === "fixed_amount" ? "Amount (IDR)" : "Percentage (%)"}
              </Label>
              <Input
                type="number"
                min={0}
                {...register("recurring_value", { valueAsNumber: true })}
                disabled={disabled}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
