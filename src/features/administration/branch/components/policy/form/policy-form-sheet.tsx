"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreatePolicy, useUpdatePolicy } from "../../../api/policy-queries";
import { usePolicyStore } from "../../../store/policy";
import { PolicyPayload } from "../../../types/policy-api";
import { PolicyForm } from "./policy-form";

export function PolicyFormSheet({ branchType }: { branchType?: string }) {
  const { t } = useTranslation();
  const { sheetOpen, closeSheet, form, selectedPolicy, selectedBranchId } =
    usePolicyStore();

  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const createPolicy = useCreatePolicy();
  const updatePolicy = useUpdatePolicy();
  const isPending = createPolicy.isPending || updatePolicy.isPending;

  const handleFormSubmit = (payload: PolicyPayload) => {
    if (isNewMode) {
      createPolicy.mutate(
        { branchId: selectedBranchId, payload },
        { onSuccess: closeSheet },
      );
    } else if (isEditMode && selectedPolicy) {
      updatePolicy.mutate(
        {
          branchId: selectedBranchId,
          policyId: selectedPolicy.id,
          payload,
        },
        { onSuccess: closeSheet },
      );
    }
  };

  const handleSaveClick = () => {
    const submit = (window as unknown as Record<string, unknown>)
      .__policyFormSubmit;
    if (typeof submit === "function") (submit as () => void)();
  };

  const getTitle = () => {
    if (isNewMode) return t("administration.branch.policy.addNewPolicy");
    if (isEditMode) return t("administration.branch.policy.editPolicy");
    return t("administration.branch.policy.policyDetails");
  };

  const getSaveButtonText = () => {
    if (isPending) return t("administration.branch.policy.saving");
    if (isNewMode) return t("administration.branch.policy.addPolicyButton");
    return t("administration.branch.policy.saveChanges");
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="inset-y-0 start-auto flex h-full w-full flex-col gap-0 border p-0 shadow-2xl sm:inset-y-8 sm:max-h-[calc(100vh-64px)] sm:max-w-none sm:rounded-lg md:w-[540px] lg:end-10 lg:w-[650px] [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="text-xl font-medium">{getTitle()}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-hidden p-0">
          <PolicyForm onSubmit={handleFormSubmit} branchType={branchType} />
        </SheetBody>

        <SheetFooter className="border-border mt-auto flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0">
          <Button variant="ghost" onClick={closeSheet}>
            {t("administration.branch.policy.close")}
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            onClick={closeSheet}
            className="mr-3"
            disabled={isPending}
          >
            {t("administration.branch.policy.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            className="font-semibold"
            disabled={isDetailMode || isPending}
          >
            {getSaveButtonText()}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
