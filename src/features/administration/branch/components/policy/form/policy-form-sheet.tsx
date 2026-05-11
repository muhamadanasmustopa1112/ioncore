"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePolicyStore } from "../../../store/policy";
import { useCreatePolicy, useUpdatePolicy } from "../../../api/policy-queries";
import { PolicyForm } from "./policy-form";
import { PolicyPayload } from "../../../types/policy-api";

export function PolicyFormSheet({ branchType }: { branchType?: string }) {
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
        { onSuccess: closeSheet }
      );
    } else if (isEditMode && selectedPolicy) {
      updatePolicy.mutate(
        {
          branchId: selectedBranchId,
          policyId: selectedPolicy.id,
          payload,
        },
        { onSuccess: closeSheet }
      );
    }
  };

  const handleSaveClick = () => {
    const submit = (
      window as unknown as Record<string, unknown>
    ).__policyFormSubmit;
    if (typeof submit === "function") (submit as () => void)();
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[540px] lg:w-[650px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNewMode
              ? "Add Branch Policy"
              : isEditMode
                ? "Edit Branch Policy"
                : "Policy Details"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <PolicyForm onSubmit={handleFormSubmit} branchType={branchType} />
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeSheet}>
            Close
          </Button>
          <div className="flex-1" />
          <Button
            variant="outline"
            onClick={closeSheet}
            className="mr-3"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveClick}
            className="font-semibold"
            disabled={isDetailMode || isPending}
          >
            {isPending
              ? "Saving..."
              : isNewMode
                ? "Add Policy"
                : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
