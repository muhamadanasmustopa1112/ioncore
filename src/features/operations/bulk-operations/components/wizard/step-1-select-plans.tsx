"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBulkOperationWizardStore } from "../../store/wizard";
import { dummyPlans } from "../../data/dummy";
import type { PlanItem } from "../../types";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

function PlanCard({
  label,
  plan,
  onSelect,
}: {
  label: string;
  plan: PlanItem | null;
  onSelect: (plan: PlanItem) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-auto w-full justify-start py-3"
          >
            {plan ? (
              <div className="flex flex-col items-start gap-1">
                <span className="font-medium">{plan.name}</span>
                <span className="text-xs text-muted-foreground">
                  {plan.speed} &bull; {formatPrice(plan.monthlyPrice)}/mo
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">
                {t("bulkOperations.selectPlan", "Select a plan...")}
              </span>
            )}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder={t("bulkOperations.searchPlan", "Search plans...")} />
            <CommandEmpty>{t("bulkOperations.noPlans", "No plans found.")}</CommandEmpty>
            <CommandGroup>
              {dummyPlans.map((p) => (
                <CommandItem
                  key={p.id}
                  value={p.id}
                  onSelect={() => {
                    onSelect(p);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      plan?.id === p.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.speed} &bull; {formatPrice(p.monthlyPrice)}/mo &bull; {p.category}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function Step1SelectPlans() {
  const { t } = useTranslation();
  const { sourcePlan, targetPlan, setSourcePlan, setTargetPlan } =
    useBulkOperationWizardStore();

  const priceDifference = useMemo(() => {
    if (sourcePlan && targetPlan) {
      return targetPlan.monthlyPrice - sourcePlan.monthlyPrice;
    }
    return null;
  }, [sourcePlan, targetPlan]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {t("bulkOperations.step1.title", "Select Plans")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "bulkOperations.step1.description",
            "Choose the source and target plans for this bulk operation."
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <PlanCard
          label={t("bulkOperations.sourcePlan", "Source Plan (Current)")}
          plan={sourcePlan}
          onSelect={setSourcePlan}
        />
        <PlanCard
          label={t("bulkOperations.targetPlan", "Target Plan (New)")}
          plan={targetPlan}
          onSelect={setTargetPlan}
        />
      </div>

      {priceDifference !== null && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("bulkOperations.monthlyPriceDiff", "Monthly Price Difference")}
            </span>
            <span
              className={`font-semibold ${
                priceDifference > 0
                  ? "text-green-600 dark:text-green-400"
                  : priceDifference < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
              }`}
            >
              {priceDifference > 0 ? "+" : ""}
              {formatPrice(priceDifference)}/mo per customer
            </span>
          </div>
        </div>
      )}

      {sourcePlan && targetPlan && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("bulkOperations.from", "From")}
            </p>
            <p className="font-medium">{sourcePlan.name}</p>
            <p className="text-sm text-muted-foreground">
              {sourcePlan.speed} &bull; {formatPrice(sourcePlan.monthlyPrice)}/mo
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">
              {t("bulkOperations.to", "To")}
            </p>
            <p className="font-medium">{targetPlan.name}</p>
            <p className="text-sm text-muted-foreground">
              {targetPlan.speed} &bull; {formatPrice(targetPlan.monthlyPrice)}/mo
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
