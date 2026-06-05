"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
} from "@/components/ui/sheet";
import { AssetForm } from "./asset-form";
import { useWarehouseStore } from "../../store/warehouse";

export function AssetFormSheet() {
  const { assetSheetOpen, setAssetSheetOpen } = useWarehouseStore();

  return (
    <Sheet open={assetSheetOpen} onOpenChange={setAssetSheetOpen}>
      <SheetContent side="right" className="sm:max-w-lg w-full overflow-y-auto">
        <SheetHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <SheetTitle className="text-lg font-extrabold text-slate-900 dark:text-white">
            Register New Asset
          </SheetTitle>
          <SheetDescription className="text-xs">
            Select asset type and fill in the details. Fields will adjust based on the selected type.
          </SheetDescription>
        </SheetHeader>
        <SheetBody className="pt-4">
          <AssetForm onSuccess={() => setAssetSheetOpen(false)} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
