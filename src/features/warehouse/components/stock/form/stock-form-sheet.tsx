"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useWarehouseStore } from "@/features/warehouse/store/warehouse";
import { StockItemForm, type StockItemFormRef } from "./stock-form";
import { StockItemDetail } from "./stock-item-detail";

export function StockFormSheet() {
  const { t } = useTranslation();
  const { stockForm, stockSheetOpen, selectedStockItem, closeStockFormSheet } = useWarehouseStore();
  const formRef = useRef<StockItemFormRef>(null);

  const isDetails = stockForm === "details";

  return (
    <Sheet open={stockSheetOpen} onOpenChange={(open) => !open && closeStockFormSheet()}>
      <SheetContent className="sm:max-w-lg w-full flex flex-col">
        <SheetHeader className="border-b px-5 py-4 shrink-0">
          <SheetTitle className="text-lg font-extrabold">
            {stockForm === "new" && t("warehouse.receiveStock", "Receive Stock")}
            {stockForm === "edit" && t("warehouse.receiveStock", "Receive Stock")}
            {stockForm === "details" && t("warehouse.stockDetails", "Stock Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-5">
            {isDetails ? (
              <StockItemDetail stockItem={selectedStockItem} />
            ) : (
              <StockItemForm
                key={stockForm === "edit" ? selectedStockItem?.id ?? "edit" : "new"}
                ref={formRef}
                onSuccess={closeStockFormSheet}
                mode={stockForm ?? "new"}
              />
            )}
          </ScrollArea>
        </SheetBody>

        {!isDetails && (
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
                {t("warehouse.createReceipt", "Create Receipt")}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
