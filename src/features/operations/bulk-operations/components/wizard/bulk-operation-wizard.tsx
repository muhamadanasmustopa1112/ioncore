"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBulkOperationWizardStore } from "../../store/wizard";
import { Step1SelectPlans } from "./step-1-select-plans";
import { Step2DefineScope } from "./step-2-define-scope";
import { Step3ReviewPreview } from "./step-3-review-preview";
import { Step4Execution } from "./step-4-execution";

interface BulkOperationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  "Select Plans",
  "Define Scope",
  "Review Preview",
  "Execution",
];

export function BulkOperationWizard({
  open,
  onOpenChange,
}: BulkOperationWizardProps) {
  const { t } = useTranslation();
  const { currentStep, setStep, reset, sourcePlan, targetPlan } =
    useBulkOperationWizardStore();

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return sourcePlan !== null && targetPlan !== null;
      case 1:
        return true;
      case 2:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 3 && canProceed()) {
      setStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] gap-0 p-0">
        <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            {t("bulkOperations.wizard.title", "New Bulk Operation")}
          </DialogTitle>
          <Button
            mode="icon"
            variant="ghost"
            size="sm"
            onClick={handleClose}
          >
            <X className="size-4" />
          </Button>
        </DialogHeader>

        <div className="border-b px-6 py-3">
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm ${
                    index === currentStep
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </span>
                {index < STEPS.length - 1 && (
                  <div className="mx-2 h-px w-6 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[400px] px-6 py-4">
          {currentStep === 0 && <Step1SelectPlans />}
          {currentStep === 1 && <Step2DefineScope />}
          {currentStep === 2 && <Step3ReviewPreview />}
          {currentStep === 3 && <Step4Execution />}
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
          {currentStep > 0 && currentStep < 3 && (
            <Button variant="outline" onClick={handleBack}>
              {t("common.back", "Back")}
            </Button>
          )}
          {currentStep < 3 && (
            <Button onClick={handleNext} disabled={!canProceed()}>
              {currentStep === 2
                ? t("bulkOperations.execute", "Execute")
                : t("common.next", "Next")}
            </Button>
          )}
          {currentStep === 3 && (
            <Button variant="outline" onClick={handleClose}>
              {t("common.close", "Close")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
