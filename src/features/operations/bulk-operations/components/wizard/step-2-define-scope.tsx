"use client";

import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBulkOperationWizardStore } from "../../store/wizard";
import { dummyAreas, dummyCustomerTypes } from "../../data/dummy";
import type { ScopeType, CustomerType } from "../../types";

const scopeOptions: { value: ScopeType; label: string; description: string }[] = [
  {
    value: "all",
    label: "All Customers",
    description: "Apply to all active customers",
  },
  {
    value: "by_area",
    label: "By Area",
    description: "Select specific areas to target",
  },
  {
    value: "by_type",
    label: "By Customer Type",
    description: "Target by customer category",
  },
  {
    value: "manual",
    label: "Manual Selection",
    description: "Pick individual customers",
  },
];

const totalCustomers = 1850;

export function Step2DefineScope() {
  const { t } = useTranslation();
  const {
    scopeType,
    setScopeType,
    selectedAreas,
    setSelectedAreas,
    selectedCustomerType,
    setSelectedCustomerType,
  } = useBulkOperationWizardStore();

  const handleAreaToggle = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          {t("bulkOperations.step2.title", "Define Scope")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "bulkOperations.step2.description",
            "Define which customers will be affected by this operation."
          )}
        </p>
      </div>

      <RadioGroup
        value={scopeType}
        onValueChange={(value) => setScopeType(value as ScopeType)}
        className="space-y-3"
      >
        {scopeOptions.map((option) => (
          <div
            key={option.value}
            className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
              scopeType === option.value
                ? "border-primary bg-primary/5"
                : "hover:bg-muted/50"
            }`}
          >
            <RadioGroupItem
              value={option.value}
              id={option.value}
              className="mt-0.5"
            />
            <div className="flex-1">
              <Label htmlFor={option.value} className="cursor-pointer font-medium">
                {option.label}
              </Label>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>

      {scopeType === "all" && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("bulkOperations.totalAffected", "Total Affected Customers")}
            </span>
            <span className="text-lg font-bold text-primary">
              {totalCustomers.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {scopeType === "by_area" && (
        <div className="space-y-3">
          <Label>{t("bulkOperations.selectAreas", "Select Areas")}</Label>
          <div className="grid grid-cols-2 gap-2">
            {dummyAreas.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => handleAreaToggle(area)}
                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  selectedAreas.includes(area)
                    ? "border-primary bg-primary/10 font-medium"
                    : "hover:bg-muted/50"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
          {selectedAreas.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {selectedAreas.length} area(s) selected &bull; ~{selectedAreas.length * 150} customers affected
            </p>
          )}
        </div>
      )}

      {scopeType === "by_type" && (
        <div className="space-y-3">
          <Label>{t("bulkOperations.selectCustomerType", "Customer Type")}</Label>
          <Select
            value={selectedCustomerType || ""}
            onValueChange={(value) =>
              setSelectedCustomerType(value as CustomerType)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("bulkOperations.chooseType", "Choose a type...")} />
            </SelectTrigger>
            <SelectContent>
              {dummyCustomerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCustomerType && (
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                {t("bulkOperations.typeAffected", {
                  count: selectedCustomerType === "broadband" ? 1200 : selectedCustomerType === "business" ? 120 : selectedCustomerType === "enterprise" ? 45 : 15,
                  type: selectedCustomerType,
                  defaultValue: "~{{count}} {{type}} customers will be affected",
                })}
              </p>
            </div>
          )}
        </div>
      )}

      {scopeType === "manual" && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            {t(
              "bulkOperations.manualHint",
              "Customer picker will be available after this step. You will be able to search and select individual customers."
            )}
          </p>
        </div>
      )}
    </div>
  );
}
