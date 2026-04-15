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
import { useCapabilityStore } from "../../../store/capability";
import { useCreateCapability, useUpdateCapability } from "../../../api/capability-queries";
import { CapabilityForm } from "./capability-form";
import { CapabilityPayload } from "../../../types/capability-api";

export function CapabilityFormSheet() {
  const { sheetOpen, closeSheet, form, selectedCapability, selectedBranchId } =
    useCapabilityStore();

  const isNewMode = form === "new";
  const isEditMode = form === "edit";
  const isDetailMode = form === "details";

  const createCapability = useCreateCapability();
  const updateCapability = useUpdateCapability();
  const isPending = createCapability.isPending || updateCapability.isPending;

  const handleFormSubmit = (payload: CapabilityPayload) => {
    if (isNewMode) {
      createCapability.mutate(
        { branchId: selectedBranchId, payload },
        { onSuccess: closeSheet }
      );
    } else if (isEditMode && selectedCapability) {
      updateCapability.mutate(
        {
          branchId: selectedBranchId,
          capabilityId: selectedCapability.id,
          payload,
        },
        { onSuccess: closeSheet }
      );
    }
  };

  const handleSaveClick = () => {
    const submit = (
      window as unknown as Record<string, unknown>
    ).__capabilityFormSubmit;
    if (typeof submit === "function") (submit as () => void)();
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[600px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNewMode
              ? "Add Capability"
              : isEditMode
                ? "Edit Capability"
                : "Capability Details"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <CapabilityForm onSubmit={handleFormSubmit} />
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
                ? "Add Capability"
                : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
