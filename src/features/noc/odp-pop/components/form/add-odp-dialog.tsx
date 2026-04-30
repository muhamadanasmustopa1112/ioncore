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
import { useOdpStore } from "../../store/odp";
import { OdpForm, OdpFormRef } from "./odp-form";

export function OdpDialog() {
  const { odpSheetOpen, setOdpFormSheetOpen, closeOdpFormSheet, form: formMode, selectedOdp } = useOdpStore();
  const formRef = useRef<OdpFormRef>(null);

  const isNewMode = formMode === "new";
  const isEditMode = formMode === "edit";
  const isDetailMode = formMode === "details";

  const handleSave = () => {
    formRef.current?.submit();
  };

  return (
    <Dialog open={odpSheetOpen} onOpenChange={setOdpFormSheetOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isNewMode ? "Add New ODP" : isEditMode ? "Edit ODP" : "ODP Details"}
          </DialogTitle>
          <DialogDescription>
            {isNewMode 
              ? "Fill in the details below to add a new ODP device to this infrastructure." 
              : isEditMode 
                ? `Update details for ODP ${selectedOdp?.name}` 
                : `Viewing details for ODP ${selectedOdp?.name}`}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="p-0">
          <OdpForm 
            ref={formRef} 
            mode={formMode || "new"} 
            odpId={selectedOdp?.id ? String(selectedOdp.id) : undefined}
            onSuccess={closeOdpFormSheet} 
            readOnly={isDetailMode}
          />
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeOdpFormSheet}
          >
            {isDetailMode ? "Close" : "Cancel"}
          </Button>
          {!isDetailMode && (
            <Button 
              onClick={handleSave} 
              disabled={formRef.current?.isPending}
            >
              {formRef.current?.isPending ? "Saving..." : isNewMode ? "Save ODP" : "Save Changes"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

