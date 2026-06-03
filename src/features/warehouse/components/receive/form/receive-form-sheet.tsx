"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { ReceiveForm, type ReceiveFormRef } from "./receive-form";

export function ReceiveFormSheet() {
  const { t } = useTranslation();
  const { receiveForm, receiveSheetOpen, closeReceiveFormSheet } = useWarehouseStore();
  const formRef = useRef<ReceiveFormRef>(null);

  const isReadOnly = receiveForm === "details";

  return (
    <Sheet open={receiveSheetOpen} onOpenChange={(open) => !open && closeReceiveFormSheet()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="border-b px-5 py-4 shrink-0">
          <SheetTitle className="text-lg font-extrabold">
            {receiveForm === "new" && t("warehouse.receiveStock", "Receive Stock")}
            {receiveForm === "edit" && t("warehouse.editReceive", "Edit Receive Record")}
            {receiveForm === "details" && t("warehouse.receiveDetails", "Receive Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <ReceiveForm ref={formRef} onSuccess={closeReceiveFormSheet} mode={receiveForm ?? "new"} />
          </ScrollArea>
        </SheetBody>

        {!isReadOnly && (
          <SheetFooter className="border-t p-5 shrink-0">
            <div className="flex w-full justify-end gap-3">
              <Button variant="outline" className="h-10 px-4 font-semibold text-xs" onClick={closeReceiveFormSheet}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold text-xs"
                onClick={() => formRef.current?.submit()}
                disabled={formRef.current?.isPending}
              >
                {t("warehouse.receiveStock", "Receive Stock")}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
