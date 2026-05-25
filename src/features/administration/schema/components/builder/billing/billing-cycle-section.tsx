"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiCalendarLine } from "@remixicon/react";
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

interface BillingCycleSectionProps {
  form: UseFormReturn<BillingFormValues>;
  disabled: boolean;
}

export function BillingCycleSection({ form, disabled }: BillingCycleSectionProps) {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = form;

  const billingAnchor = watch("billing_cycle.anchor");

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <RiCalendarLine className="size-4 text-blue-500" />
        <h3 className="text-sm font-semibold">{t("administration.schema.billingCycle")}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.cycleType")}</Label>
          <Select
            value={watch("billing_cycle.type")}
            onValueChange={(v) =>
              setValue("billing_cycle.type", v as BillingFormValues["billing_cycle"]["type"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{t("administration.schema.cycleMonthly")}</SelectItem>
              <SelectItem value="quarterly">{t("administration.schema.cycleQuarterly")}</SelectItem>
              <SelectItem value="annual">{t("administration.schema.cycleAnnual")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.billingAnchor")}</Label>
          <Select
            value={watch("billing_cycle.anchor")}
            onValueChange={(v) =>
              setValue("billing_cycle.anchor", v as BillingFormValues["billing_cycle"]["anchor"])
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anniversary">{t("administration.schema.anchorAnniversary")}</SelectItem>
              <SelectItem value="fixed_day">{t("administration.schema.anchorFixedDay")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {billingAnchor === "fixed_day" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.dayOfMonth")}</Label>
            <Input
              type="number"
              min={1}
              max={31}
              disabled={disabled}
              {...register("billing_cycle.day_of_month", { valueAsNumber: true })}
            />
            {errors.billing_cycle?.day_of_month && (
              <p className="text-xs text-red-500">{errors.billing_cycle.day_of_month.message}</p>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            {t("administration.schema.generateInvoiceDaysBefore")}
          </Label>
          <Input
            type="number"
            min={1}
            disabled={disabled}
            {...register("billing_cycle.generate_days_before", { valueAsNumber: true })}
          />
          {errors.billing_cycle?.generate_days_before && (
            <p className="text-xs text-red-500">{errors.billing_cycle.generate_days_before.message}</p>
          )}
        </div>
        <div className="flex items-center justify-between md:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">{t("administration.schema.allowPartialPayments")}</Label>
          <Switch
            size="lg"
            checked={watch("billing_cycle.allow_partial_payments")}
            onCheckedChange={(v) => setValue("billing_cycle.allow_partial_payments", v)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
