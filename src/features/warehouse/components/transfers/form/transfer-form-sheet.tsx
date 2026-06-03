"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { TransferForm, type TransferFormRef } from "./transfer-form";

export function TransferFormSheet() {
  const { t } = useTranslation();
  const { transferForm, transferSheetOpen, closeTransferFormSheet } = useWarehouseStore();
  const formRef = useRef<TransferFormRef>(null);

  const isReadOnly = transferForm === "details";

  return (
    <Sheet open={transferSheetOpen} onOpenChange={(open) => !open && closeTransferFormSheet()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="border-b px-5 py-4 shrink-0">
          <SheetTitle className="text-lg font-extrabold">
            {transferForm === "new" && t("warehouse.newTransfer", "New Transfer")}
            {transferForm === "edit" && t("warehouse.editTransfer", "Edit Transfer")}
            {transferForm === "details" && t("warehouse.transferDetails", "Transfer Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <TransferForm ref={formRef} onSuccess={closeTransferFormSheet} mode={transferForm ?? "new"} />
          </ScrollArea>
        </SheetBody>

        {!isReadOnly && (
          <SheetFooter className="border-t p-5 shrink-0">
            <div className="flex w-full justify-end gap-3">
              <Button variant="outline" className="h-10 px-4 font-semibold text-xs" onClick={closeTransferFormSheet}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold text-xs"
                onClick={() => formRef.current?.submit()}
                disabled={formRef.current?.isPending}
              >
                {transferForm === "new" ? t("common.create", "Create") : t("common.save", "Save")}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
