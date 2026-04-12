"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiInformationLine } from "@remixicon/react";
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
import { billingFormSchema, type BillingFormValues } from "../../../types/billing-schema";
import { useSchemaStore } from "../../../store/schema";
import { BillingCycleSection } from "./billing-cycle-section";
import { OtcSection } from "./otc-section";
import { PaymentSection } from "./payment-section";
import { PricingContractSection } from "./pricing-contract-section";

const DEFAULT_BILLING: BillingFormValues = {
  name: "",
  customer_type: "residential",
  billing_cycle: {
    type: "monthly",
    anchor: "anniversary",
    day_of_month: 1,
    generate_days_before: 3,
    allow_partial_payments: false,
  },
  otc: {
    type: "prepaid",
    invoice_trigger: "before_wo_dispatch",
    payment_required_before_wo: true,
    generate_faktur_pajak: true,
  },
  first_payment: {
    grace_period_days: 3,
    suspension_automatic: false,
    suspension_notification: true,
  },
  recurring_payment: {
    grace_period_days: 7,
    late_fee_enabled: false,
    suspension_automatic: false,
    suspension_requires_manual_approval: false,
    suspension_requires_executive_approval: false,
  },
  payment_terms: "net_7",
  payment_methods: ["bank_transfer"],
  pricing_type: "flat_rate",
  tax_included: false,
  tax_rate: 11,
  contract_lock_in_months: 12,
  early_termination_enabled: false,
};

export function BillingForm() {
  const { form } = useSchemaStore();
  const isDetailMode = form === "details";

  const rhfForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: DEFAULT_BILLING,
  });

  const { register, watch, setValue, formState: { errors } } = rhfForm;

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
                  placeholder="e.g. Residential Monthly Billing"
                  disabled={isDetailMode}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Customer Type
                </Label>
                <Select
                  value={watch("customer_type")}
                  onValueChange={(v) =>
                    setValue("customer_type", v as BillingFormValues["customer_type"])
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

          <BillingCycleSection form={rhfForm} disabled={isDetailMode} />
          <OtcSection form={rhfForm} disabled={isDetailMode} />
          <PaymentSection form={rhfForm} disabled={isDetailMode} />
          <PricingContractSection form={rhfForm} disabled={isDetailMode} />

        </div>
      </ScrollArea>
    </div>
  );
}
