"use client";

import { UseFormReturn } from "react-hook-form";
import { RiUserAddLine } from "@remixicon/react";
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

interface ReferralSectionProps {
  form: UseFormReturn<CommissionFormValues>;
  disabled: boolean;
}

export function ReferralSection({ form, disabled }: ReferralSectionProps) {
  const { register, watch, setValue } = form;

  const referralEnabled = watch("referral_enabled");

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiUserAddLine className="size-4 text-green-500" />
        <h3 className="text-sm font-semibold">Referral Commission</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Referral Enabled</Label>
          <Switch
            size="lg"
            checked={referralEnabled}
            onCheckedChange={(v) => setValue("referral_enabled", v)}
            disabled={disabled}
          />
        </div>
        {referralEnabled && (
          <>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Reward Type</Label>
              <Select
                value={watch("referral_reward_type") ?? "cash"}
                onValueChange={(v) =>
                  setValue("referral_reward_type", v as "cash" | "account_credit" | "voucher")
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="account_credit">Account Credit</SelectItem>
                  <SelectItem value="voucher">Voucher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Reward Value Type</Label>
              <Select
                value={
                  (watch("referral_reward_value") !== undefined ? "fixed" : "fixed")
                }
                onValueChange={() => {}}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Reward Value</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                {...register("referral_reward_value", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Trigger</Label>
              <Select
                value={watch("referral_trigger") ?? "on_first_payment"}
                onValueChange={(v) =>
                  setValue("referral_trigger", v as "on_first_payment" | "on_activation")
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on_first_payment">On First Payment</SelectItem>
                  <SelectItem value="on_activation">On Activation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Disbursement</Label>
              <Select
                value={watch("referral_disbursement") ?? "account_credit"}
                onValueChange={(v) =>
                  setValue(
                    "referral_disbursement",
                    v as "account_credit" | "bank_transfer" | "voucher_code"
                  )
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account_credit">Account Credit</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="voucher_code">Voucher Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Min Plan Price (IDR)</Label>
              <Input
                type="number"
                min={0}
                disabled={disabled}
                {...register("referral_min_plan_price", { valueAsNumber: true })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Referrer Must Be Active</Label>
              <Switch
                size="lg"
                checked={watch("referral_referrer_must_be_active") ?? false}
                onCheckedChange={(v) => setValue("referral_referrer_must_be_active", v)}
                disabled={disabled}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
