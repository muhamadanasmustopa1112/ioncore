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
import { useOltStore } from "../../store/olt";
import { OltForm, OltFormRef } from "./olt-form";

export function AddOltDialog() {
  const { oltSheetOpen, setOltFormSheetOpen, openOltFormSheet, closeOltFormSheet } = useOltStore();
  const formRef = useRef<OltFormRef>(null);

  const handleSave = () => {
    formRef.current?.submit();
  };

  return (
    <Dialog open={oltSheetOpen} onOpenChange={setOltFormSheetOpen}>
      <Button size="sm" className="h-8" onClick={() => openOltFormSheet("new")}>
        <Plus className="size-4" />
        Add New OLT
      </Button>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New OLT</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new OLT device to this POP.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="p-0">
          <OltForm 
            ref={formRef} 
            mode="new" 
            onSuccess={closeOltFormSheet} 
          />
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={closeOltFormSheet}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={formRef.current?.isPending}
          >
            {formRef.current?.isPending ? "Saving..." : "Save OLT"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
