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
import { useOdpStore } from "../../store/odp";
import { OdpForm, OdpFormRef } from "./odp-form";

export function OdpDialog() {
  const { t } = useTranslation();
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
            {isNewMode ? t("odpPop.addNewOdp", "Add New ODP") : isEditMode ? t("odpPop.editOdp", "Edit ODP") : t("odpPop.odpDetails", "ODP Details")}
          </DialogTitle>
          <DialogDescription>
            {isNewMode
              ? t("odpPop.addNewOdpDesc", "Fill in the details below to add a new ODP device to this infrastructure.")
              : isEditMode
                ? `${t("odpPop.editOdpDesc", "Update details for ODP")} ${selectedOdp?.name}`
                : `${t("odpPop.viewOdpDesc", "Viewing details for ODP")} ${selectedOdp?.name}`}
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
            {isDetailMode ? t("common.close") : t("common.cancel")}
          </Button>
          {!isDetailMode && (
            <Button 
              onClick={handleSave} 
              disabled={formRef.current?.isPending}
            >
              {formRef.current?.isPending ? t("odpPop.saving") : isNewMode ? t("odpPop.saveOdp", "Save ODP") : t("odpPop.saveChanges")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

