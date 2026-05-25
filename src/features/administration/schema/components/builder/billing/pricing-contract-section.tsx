"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiPriceTag3Line, RiFileTextLine } from "@remixicon/react";
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
import { type BillingFormValues } from "../../../types/billing-schema";

interface PricingContractSectionProps {
  form: UseFormReturn<BillingFormValues>;
  disabled: boolean;
}

export function PricingContractSection({ form, disabled }: PricingContractSectionProps) {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = form;

  const earlyTerminationEnabled = watch("early_termination_enabled");

  return (
    <>
      {/* Section 5: Pricing */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <RiPriceTag3Line className="size-4 text-orange-500" />
          <h3 className="text-sm font-semibold">{t("administration.schema.pricing")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.pricingType")}</Label>
            <Select
              value={watch("pricing_type")}
              onValueChange={(v) =>
                setValue("pricing_type", v as BillingFormValues["pricing_type"])
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat_rate">{t("administration.schema.pricingFlatRate")}</SelectItem>
                <SelectItem value="negotiated">{t("administration.schema.pricingNegotiated")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.taxRate")}</Label>
            <Input
              type="number"
              min={0}
              max={100}
              disabled={disabled}
              {...register("tax_rate", { valueAsNumber: true })}
            />
            {errors.tax_rate && (
              <p className="text-xs text-red-500">{errors.tax_rate.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.taxIncluded")}</Label>
            <Switch
              size="lg"
              checked={watch("tax_included")}
              onCheckedChange={(v) => setValue("tax_included", v)}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Section 6: Contract */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <RiFileTextLine className="size-4 text-red-500" />
          <h3 className="text-sm font-semibold">{t("administration.schema.contract")}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.lockInMonths")}</Label>
            <Input
              type="number"
              min={0}
              disabled={disabled}
              {...register("contract_lock_in_months", { valueAsNumber: true })}
            />
            {errors.contract_lock_in_months && (
              <p className="text-xs text-red-500">{errors.contract_lock_in_months.message}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.earlyTerminationEnabled")}</Label>
            <Switch
              size="lg"
              checked={earlyTerminationEnabled}
              onCheckedChange={(v) => setValue("early_termination_enabled", v)}
              disabled={disabled}
            />
          </div>
          {earlyTerminationEnabled && (
            <>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.terminationType")}</Label>
                <Select
                  value={watch("early_termination_type") ?? "fixed_amount"}
                  onValueChange={(v) =>
                    setValue("early_termination_type", v as "fixed_amount" | "percentage_of_remaining")
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed_amount">{t("administration.schema.terminationFixed")}</SelectItem>
                    <SelectItem value="percentage_of_remaining">{t("administration.schema.terminationPercentage")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.terminationValue")}</Label>
                <Input
                  type="number"
                  min={0}
                  disabled={disabled}
                  {...register("early_termination_value", { valueAsNumber: true })}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
