"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMaintenanceStore } from "../../store/maintenance";
import { MaintenanceForm, type MaintenanceFormRef } from "./maintenance-form";

export function MaintenanceFormSheet() {
  const { sheetOpen, closeFormSheet, form: formMode } = useMaintenanceStore();
  const formRef = useRef<MaintenanceFormRef>(null);

  const isNewMode = formMode === "new";
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";
  const isApprovalMode = formMode === "approval";
  const canSave = !isDetailMode && !isApprovalMode;

  const handleSave = () => {
    formRef.current?.submit();
  };

  const title = isNewMode
    ? "New Maintenance"
    : isEditMode
      ? "Edit Maintenance"
      : isApprovalMode
        ? "Approve Maintenance"
        : "Maintenance Details";

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeFormSheet()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <MaintenanceForm
              ref={formRef}
              mode={formMode || "new"}
              readOnly={isDetailMode}
            />
          </ScrollArea>
        </SheetBody>

        {!isApprovalMode && (
          <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
            <Button variant="ghost" onClick={closeFormSheet}>
              Close
            </Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={closeFormSheet} className="mr-3">
              Cancel
            </Button>
            {canSave && (
              <Button
                variant="primary"
                onClick={handleSave}
                className="font-semibold"
                disabled={formRef.current?.isPending}
              >
                {isNewMode ? "Create Maintenance" : "Save Changes"}
              </Button>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
