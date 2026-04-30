"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
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

export function AddOdpDialog() {
  const { odpSheetOpen, setOdpFormSheetOpen, openOdpFormSheet, closeOdpFormSheet } = useOdpStore();
  const formRef = useRef<OdpFormRef>(null);

  const handleSave = () => {
    formRef.current?.submit();
  };

  return (
    <Dialog open={odpSheetOpen} onOpenChange={setOdpFormSheetOpen}>
      <Button size="sm" className="h-8" onClick={() => openOdpFormSheet("new")}>
        <Plus className="size-4" />
        Add ODP
      </Button>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New ODP</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new ODP device to this infrastructure.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="p-0">
          <OdpForm 
            ref={formRef} 
            mode="new" 
            onSuccess={closeOdpFormSheet} 
          />
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeOdpFormSheet}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={formRef.current?.isPending}
          >
            {formRef.current?.isPending ? "Saving..." : "Save ODP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
