"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { useOltStore } from "../../store/olt";
import { OltForm, OltFormRef } from "./olt-form";

export function OltDialog() {
  const { oltSheetOpen, setOltFormSheetOpen, closeOltFormSheet, form: formMode, selectedOlt } = useOltStore();
  const formRef = useRef<OltFormRef>(null);

  const isNewMode = formMode === "new";
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";

  const handleSave = () => {
    formRef.current?.submit();
  };

  return (
    <Dialog open={oltSheetOpen} onOpenChange={setOltFormSheetOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isNewMode ? "Add New OLT" : isEditMode ? "Edit OLT" : "OLT Details"}
          </DialogTitle>
          <DialogDescription>
            {isNewMode 
              ? "Fill in the details below to add a new OLT device to this POP." 
              : isEditMode 
                ? `Update details for OLT ${selectedOlt?.name}` 
                : `Viewing details for OLT ${selectedOlt?.name}`}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="p-0">
          <OltForm 
            ref={formRef} 
            mode={formMode || "new"} 
            oltId={selectedOlt?.id ? String(selectedOlt.id) : undefined}
            onSuccess={closeOltFormSheet} 
            readOnly={isDetailMode}
          />
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeOltFormSheet}
          >
            {isDetailMode ? "Close" : "Cancel"}
          </Button>
          {!isDetailMode && (
            <Button 
              onClick={handleSave} 
              disabled={formRef.current?.isPending}
            >
              {formRef.current?.isPending ? "Saving..." : isNewMode ? "Save OLT" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

