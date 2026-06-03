"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { StockForm, type StockFormRef } from "./stock-form";

export function StockFormSheet() {
  const { t } = useTranslation();
  const { stockForm, stockSheetOpen, closeStockFormSheet } = useWarehouseStore();
  const formRef = useRef<StockFormRef>(null);

  const isReadOnly = stockForm === "details";

  return (
    <Sheet open={stockSheetOpen} onOpenChange={(open) => !open && closeStockFormSheet()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="border-b px-5 py-4 shrink-0">
          <SheetTitle className="text-lg font-extrabold">
            {stockForm === "new" && t("warehouse.addStockItem", "Add Stock Item")}
            {stockForm === "edit" && t("warehouse.editStockItem", "Edit Stock Item")}
            {stockForm === "details" && t("warehouse.stockDetails", "Stock Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <StockForm ref={formRef} onSuccess={closeStockFormSheet} mode={stockForm ?? "new"} />
          </ScrollArea>
        </SheetBody>

        {!isReadOnly && (
          <SheetFooter className="border-t p-5 shrink-0">
            <div className="flex w-full justify-end gap-3">
              <Button variant="outline" className="h-10 px-4 font-semibold text-xs" onClick={closeStockFormSheet}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="primary"
                className="h-10 px-5 font-semibold text-xs"
                onClick={() => formRef.current?.submit()}
                disabled={formRef.current?.isPending}
              >
                {stockForm === "new" ? t("common.create", "Create") : t("common.save", "Save")}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
