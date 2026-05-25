"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
            {isNewMode ? t("odpPop.addNewOlt") : isEditMode ? t("odpPop.editOlt", "Edit OLT") : t("odpPop.oltDetails", "OLT Details")}
          </DialogTitle>
          <DialogDescription>
            {isNewMode
              ? t("odpPop.addNewOltDesc", "Fill in the details below to add a new OLT device to this POP.")
              : isEditMode
                ? `${t("odpPop.editOltDesc", "Update details for OLT")} ${selectedOlt?.name}`
                : `${t("odpPop.viewOltDesc", "Viewing details for OLT")} ${selectedOlt?.name}`}
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
            {isDetailMode ? t("common.close") : t("common.cancel")}
          </Button>
          {!isDetailMode && (
            <Button 
              onClick={handleSave} 
              disabled={formRef.current?.isPending}
            >
              {formRef.current?.isPending ? t("odpPop.saving", "Saving...") : isNewMode ? t("odpPop.saveOlt", "Save OLT") : t("odpPop.saveChanges", "Save Changes")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

