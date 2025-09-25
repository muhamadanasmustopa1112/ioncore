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
  mode: "new" | "edit";
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
      <SheetContent className="gap-0 lg:w-[820px] sm:max-w-none inset-5 border start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        {/* Header */}
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle className="font-medium">
            {isNewMode ? "New Employee" : "Edit Employee"}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <SheetBody className="p-0 grow">
          <EmployeeForm />
        </SheetBody>

        {/* Footer */}
        <SheetFooter className="flex-row border-t pb-4 p-5 border-border gap-2.5 lg:gap-0">
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
