"use client";

import { UseFormReturn } from "react-hook-form";
import { RiBankCardLine } from "@remixicon/react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { type BillingFormValues } from "../../../types/billing-schema";

interface PaymentSectionProps {
  form: UseFormReturn<BillingFormValues>;
  disabled: boolean;
}

const PAYMENT_METHOD_OPTIONS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "e_wallet", label: "E-Wallet" },
  { value: "credit_card", label: "Credit Card" },
  { value: "convenience_store", label: "Convenience Store" },
];

export function PaymentSection({ form, disabled }: PaymentSectionProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const lateFeeEnabled = watch("recurring_payment.late_fee_enabled");
  const suspensionAutomatic = watch("recurring_payment.suspension_automatic");
  const paymentMethods = watch("payment_methods");

  const togglePaymentMethod = (method: string) => {
    const current = paymentMethods ?? [];
    if (current.includes(method)) {
      setValue("payment_methods", current.filter((m) => m !== method));
    } else {
      setValue("payment_methods", [...current, method]);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiBankCardLine className="size-4 text-purple-500" />
        <h3 className="text-sm font-semibold">Payment</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Payment Terms</Label>
          <Select
            value={watch("payment_terms")}
            onValueChange={(v) =>
              setValue("payment_terms", v as BillingFormValues["payment_terms"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="net_7">Net 7</SelectItem>
              <SelectItem value="net_15">Net 15</SelectItem>
              <SelectItem value="net_30">Net 30</SelectItem>
              <SelectItem value="net_45">Net 45</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Recurring Grace Period (days)
          </Label>
          <Input
            type="number"
            min={0}
            disabled={disabled}
            {...register("recurring_payment.grace_period_days", { valueAsNumber: true })}
          />
          {errors.recurring_payment?.grace_period_days && (
            <p className="text-xs text-red-500">{errors.recurring_payment.grace_period_days.message}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Payment Methods</Label>
          <div className="flex flex-wrap gap-4">
            {PAYMENT_METHOD_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={paymentMethods?.includes(opt.value) ?? false}
                  onCheckedChange={() => togglePaymentMethod(opt.value)}
                  disabled={disabled}
                />
                <span className="text-xs text-muted-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.payment_methods && (
            <p className="text-xs text-red-500">{errors.payment_methods.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Late Fee Enabled</Label>
          <Switch
            size="sm"
            checked={lateFeeEnabled}
            onCheckedChange={(v) => setValue("recurring_payment.late_fee_enabled", v)}
            disabled={disabled}
          />
        </div>
        {lateFeeEnabled && (
          <>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Late Fee Type</Label>
              <Select
                value={watch("recurring_payment.late_fee_type") ?? "percentage"}
                onValueChange={(v) =>
                  setValue("recurring_payment.late_fee_type", v as "percentage" | "fixed_amount")
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Late Fee Value</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                {...register("recurring_payment.late_fee_value", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Apply After Days</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                {...register("recurring_payment.late_fee_apply_after_days", { valueAsNumber: true })}
              />
            </div>
          </>
        )}
        <div className="flex items-center justify-between md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Suspension Automatic</Label>
          <Switch
            size="sm"
            checked={suspensionAutomatic}
            onCheckedChange={(v) => setValue("recurring_payment.suspension_automatic", v)}
            disabled={disabled}
          />
        </div>
        {suspensionAutomatic && (
          <>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Requires Manual Approval</Label>
              <Switch
                size="sm"
                checked={watch("recurring_payment.suspension_requires_manual_approval")}
                onCheckedChange={(v) =>
                  setValue("recurring_payment.suspension_requires_manual_approval", v)
                }
                disabled={disabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Requires Executive Approval</Label>
              <Switch
                size="sm"
                checked={watch("recurring_payment.suspension_requires_executive_approval")}
                onCheckedChange={(v) =>
                  setValue("recurring_payment.suspension_requires_executive_approval", v)
                }
                disabled={disabled}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
