"use client";

import { useTranslation } from "react-i18next";
import { Layers, GitBranch, Wrench } from "lucide-react";
import { useBulkOperationWizardStore } from "../../store/wizard";
import type { BulkOperationType } from "../../types";

const OPERATION_TYPES: {
  value: BulkOperationType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    value: "plan_change",
    label: "Plan Change",
    description: "Migrate customers from one plan to another (e.g., speed upgrade)",
    icon: Layers,
  },
  {
    value: "odp_migration",
    label: "ODP Migration",
    description: "Move customers from one ODP to another for capacity balancing",
    icon: GitBranch,
  },
  {
    value: "bulk_wo",
    label: "Bulk Work Order",
    description: "Create multiple work orders at once for scheduled maintenance",
    icon: Wrench,
  },
];

export function Step0SelectType() {
  const { t } = useTranslation();
  const { operationType, setOperationType, setStep } = useBulkOperationWizardStore();

  const handleSelect = (type: BulkOperationType) => {
    setOperationType(type);
    setStep(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">
          {t("bulkOperations.selectType", "Select Operation Type")}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Choose the type of bulk operation you want to perform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {OPERATION_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = operationType === type.value;

          return (
            <button
              key={type.value}
              onClick={() => handleSelect(type.value)}
              className={`flex items-start gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border"
              }`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{type.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
