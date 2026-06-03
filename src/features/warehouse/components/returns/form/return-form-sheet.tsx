"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { ReturnForm, type ReturnFormRef } from "./return-form";

export function ReturnFormSheet() {
  const { t } = useTranslation();
  const { returnForm, returnSheetOpen, closeReturnFormSheet } = useWarehouseStore();
  const formRef = useRef<ReturnFormRef>(null);

  const isReadOnly = returnForm === "details";

  return (
    <Sheet open={returnSheetOpen} onOpenChange={(open) => !open && closeReturnFormSheet()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="border-b px-5 py-4 shrink-0">
          <SheetTitle className="text-lg font-extrabold">
            {returnForm === "new" && t("warehouse.newReturn", "New Device Return")}
            {returnForm === "edit" && t("warehouse.editReturn", "Edit Return")}
            {returnForm === "details" && t("warehouse.returnDetails", "Return Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <ReturnForm ref={formRef} onSuccess={closeReturnFormSheet} mode={returnForm ?? "new"} />
          </ScrollArea>
        </SheetBody>

        {!isReadOnly && (
          <SheetFooter className="border-t p-5 shrink-0">
            <div className="flex w-full justify-end gap-3">
              <Button variant="outline" className="h-10 px-4 font-semibold text-xs" onClick={closeReturnFormSheet}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold text-xs"
                onClick={() => formRef.current?.submit()}
                disabled={formRef.current?.isPending}
              >
                {returnForm === "new" ? t("common.create", "Create") : t("common.save", "Save")}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
