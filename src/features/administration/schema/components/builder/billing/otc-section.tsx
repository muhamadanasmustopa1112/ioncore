"use client";

import { UseFormReturn } from "react-hook-form";
import { RiMoneyDollarCircleLine } from "@remixicon/react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type BillingFormValues } from "../../../types/billing-schema";

interface OtcSectionProps {
  form: UseFormReturn<BillingFormValues>;
  disabled: boolean;
}

export function OtcSection({ form, disabled }: OtcSectionProps) {
  const { watch, setValue } = form;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiMoneyDollarCircleLine className="size-4 text-green-500" />
        <h3 className="text-sm font-semibold">One-Time Charge (OTC)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">OTC Type</Label>
          <Select
            value={watch("otc.type")}
            onValueChange={(v) =>
              setValue("otc.type", v as BillingFormValues["otc"]["type"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="prepaid">Prepaid</SelectItem>
              <SelectItem value="postpaid">Postpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Invoice Trigger</Label>
          <Select
            value={watch("otc.invoice_trigger")}
            onValueChange={(v) =>
              setValue("otc.invoice_trigger", v as BillingFormValues["otc"]["invoice_trigger"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="before_wo_dispatch">Before WO Dispatch</SelectItem>
              <SelectItem value="after_noc_verification">After NOC Verification</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Payment Required Before WO</Label>
          <Switch
            size="sm"
            checked={watch("otc.payment_required_before_wo")}
            onCheckedChange={(v) => setValue("otc.payment_required_before_wo", v)}
            disabled={disabled}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Generate Faktur Pajak</Label>
          <Switch
            size="sm"
            checked={watch("otc.generate_faktur_pajak")}
            onCheckedChange={(v) => setValue("otc.generate_faktur_pajak", v)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
