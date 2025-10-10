"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmployeeForm } from "./employee-form";

export function EmployeeFormSheet({
  mode,
  open,
  onOpenChange,
}: {
  mode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isNewMode = mode === "new";
  const isEditMode = mode === "edit";

  // Form state
  const [fullName, setFullName] = useState(isEditMode ? "Jeroen de Jong" : "");
  const [email, setEmail] = useState(
    isEditMode ? "jeroen.dejong@example.com" : "",
  );
  const [phoneNumber, setPhoneNumber] = useState(isEditMode ? "612345678" : "");
  const [status, setStatus] = useState(isEditMode ? "active" : "");
  const [companyName, setCompanyName] = useState(
    isEditMode ? "Acme Corporation" : "",
  );
  const [timeZone, setTimeZone] = useState(
    isEditMode ? "europe/amsterdam" : "",
  );

  // Handle form actions
  const handleSave = () => {
    console.log(`${isNewMode ? "Creating" : "Saving"} customer:`, {
      fullName,
      email,
      phoneNumber,
      status,
      companyName,
      timeZone,
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="inset-5 start-auto h-auto gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[820px] [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5">
        {/* Header */}
        <SheetHeader className="border-border border-b px-5 py-3.5">
          <SheetTitle className="font-medium">
            {isNewMode ? "New Employee" : "Edit Employee"}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <SheetBody className="grow p-0">
          <EmployeeForm />
        </SheetBody>

        {/* Footer */}
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0">
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="mono" onClick={handleSave}>
            {isNewMode ? "Create" : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
