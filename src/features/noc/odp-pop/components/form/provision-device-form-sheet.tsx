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
import { ProvisionDeviceForm } from "./provision-device-form";
import { useProvisioningStore } from "../../store/provisioning";

export function ProvisionDeviceFormSheet() {
  const { isProvisioningSheetOpen, closeProvisioningSheet } = useProvisioningStore();

  return (
    <Sheet open={isProvisioningSheetOpen} onOpenChange={(open) => !open && closeProvisioningSheet()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        {/* Header */}
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl text-foreground">
            Provision New Device
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ProvisionDeviceForm />
        </SheetBody>

        {/* Footer */}
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeProvisioningSheet}>
            Close
          </Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeProvisioningSheet} className="mr-3">
            Cancel
          </Button>
          <Button
            type="submit"
            form="provision-device-form"
            variant="primary"
            className="font-semibold"
          >
            Provision Device
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
