import { useRef } from "react";
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
import { useInventoryConfigStore } from "../../store/inventory-config";
import { InventoryConfigForm, type InventoryConfigFormRef } from "./inventory-config-form";

export function InventoryConfigFormSheet() {
  const { t } = useTranslation();
  const { sheetOpen, closeFormSheet, form: formMode, selectedConfig } = useInventoryConfigStore();
  const formRef = useRef<InventoryConfigFormRef>(null);

  const isNewMode = formMode === "new";
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";

  const handleSave = () => {
    formRef.current?.submit();
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeFormSheet()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNewMode
              ? t("warehouse.addInventoryConfig", "Add Inventory Config")
              : isEditMode
              ? t("warehouse.editInventoryConfig", "Edit Inventory Config")
              : t("warehouse.inventoryConfigDetails", "Inventory Config Details")}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <InventoryConfigForm
            ref={formRef}
            mode={formMode || "new"}
            warehouseId={selectedConfig?.warehouseId}
            readOnly={isDetailMode}
          />
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeFormSheet}>
            {t("common.close", "Close")}
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeFormSheet} className="mr-3">
            {t("common.cancel", "Cancel")}
          </Button>
          {!isDetailMode && (
            <Button
              variant="primary"
              onClick={handleSave}
              className="font-semibold"
              disabled={formRef.current?.isPending}
            >
              {isNewMode
                ? t("common.create", "Create")
                : t("common.saveChanges", "Save Changes")}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
