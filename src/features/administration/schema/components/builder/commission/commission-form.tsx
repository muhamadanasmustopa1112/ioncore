"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiInformationLine,
  RiPercentLine,
} from "@remixicon/react";
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
import { commissionFormSchema, type CommissionFormValues } from "../../../types/commission-schema";
import { useSchemaStore } from "../../../store/schema";
import { CommissionSplitsSection } from "./commission-splits-section";
import { ReferralSection } from "./referral-section";

const DEFAULT_COMMISSION: CommissionFormValues = {
  name: "",
  customer_type: "residential",
  commission_type: "percentage",
  commission_value: 10,
  calculation_base: "first_invoice_amount",
  payment_timing: "on_first_payment",
  assignment: {
    sales_person: 55,
    sales_manager_enabled: true,
    sales_manager_percentage: 5,
    sales_manager_level: "direct_manager",
    sales_branch: 15,
    infrastructure_branch_enabled: true,
    infrastructure_branch_percentage: 10,
  },
  recurring_enabled: false,
  referral_enabled: false,
};

export function CommissionForm() {
  const { form } = useSchemaStore();
  const isDetailMode = form === "details";

  const rhfForm = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionFormSchema),
    defaultValues: DEFAULT_COMMISSION,
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = rhfForm;

  const commissionType = watch("commission_type");

  const commissionValueLabel =
    commissionType === "percentage"
      ? "Percentage (%)"
      : commissionType === "fixed_amount"
      ? "Fixed Amount (IDR)"
      : "Commission Value";

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
                  placeholder="e.g. Residential Commission Schema"
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
                    setValue("customer_type", v as CommissionFormValues["customer_type"])
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

          {/* Section 2: Commission Rule */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <RiPercentLine className="size-4 text-blue-500" />
              <h3 className="text-sm font-semibold">Commission Rule</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Commission Type</Label>
                <Select
                  value={commissionType}
                  onValueChange={(v) =>
                    setValue("commission_type", v as CommissionFormValues["commission_type"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">{commissionValueLabel}</Label>
                <Input
                  type="number"
                  min={0}
                  disabled={isDetailMode}
                  {...register("commission_value", { valueAsNumber: true })}
                />
                {errors.commission_value && (
                  <p className="text-xs text-red-500">{errors.commission_value.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Calculation Base</Label>
                <Select
                  value={watch("calculation_base")}
                  onValueChange={(v) =>
                    setValue("calculation_base", v as CommissionFormValues["calculation_base"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_invoice_amount">First Invoice Amount</SelectItem>
                    <SelectItem value="annual_contract_value">Annual Contract Value</SelectItem>
                    <SelectItem value="recurring_invoice_amount">Recurring Invoice Amount</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Payment Timing</Label>
                <Select
                  value={watch("payment_timing")}
                  onValueChange={(v) =>
                    setValue("payment_timing", v as CommissionFormValues["payment_timing"])
                  }
                  disabled={isDetailMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_first_payment">On First Payment</SelectItem>
                    <SelectItem value="on_contract_signing">On Contract Signing</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <CommissionSplitsSection form={rhfForm} disabled={isDetailMode} />

          <ReferralSection form={rhfForm} disabled={isDetailMode} />

        </div>
      </ScrollArea>
    </div>
  );
}
