"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { DispatchForm, type DispatchFormRef } from "./dispatch-form";

export function DispatchFormSheet() {
  const { t } = useTranslation();
  const { dispatchForm, dispatchSheetOpen, closeDispatchFormSheet } = useWarehouseStore();
  const formRef = useRef<DispatchFormRef>(null);

  const isReadOnly = dispatchForm === "details";

  return (
    <Sheet open={dispatchSheetOpen} onOpenChange={(open) => !open && closeDispatchFormSheet()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="border-b px-5 py-4 shrink-0">
          <SheetTitle className="text-lg font-extrabold">
            {dispatchForm === "new" && t("warehouse.newDispatch", "New Dispatch")}
            {dispatchForm === "edit" && t("warehouse.editDispatch", "Edit Dispatch")}
            {dispatchForm === "details" && t("warehouse.dispatchDetails", "Dispatch Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <DispatchForm ref={formRef} onSuccess={closeDispatchFormSheet} mode={dispatchForm ?? "new"} />
          </ScrollArea>
        </SheetBody>

        {!isReadOnly && (
          <SheetFooter className="border-t p-5 shrink-0">
            <div className="flex w-full justify-end gap-3">
              <Button variant="outline" className="h-10 px-4 font-semibold text-xs" onClick={closeDispatchFormSheet}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold text-xs"
                onClick={() => formRef.current?.submit()}
                disabled={formRef.current?.isPending}
              >
                {dispatchForm === "new" ? t("common.create", "Create") : t("common.save", "Save")}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
