"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEwoStore } from "../../store/ewo";
import { useCreateEwo } from "../../api/post-ewo";
import { useUpdateEwo } from "../../api/put-ewo";
import type { CreateEwoPayload } from "../../types/ewo";
import { EwoForm, type EwoFormRef } from "./ewo-form";

export function EwoFormSheet() {
  const { t } = useTranslation();
  const { form, sheetOpen, selectedItem, closeFormSheet } = useEwoStore();
  const create = useCreateEwo();
  const update = useUpdateEwo();
  const isPending = create.isPending || update.isPending;
  const formRef = useRef<EwoFormRef>(null);

  const handleSubmit = (payload: CreateEwoPayload) => {
    if (form === "new") {
      create.mutate(payload, { onSuccess: closeFormSheet });
    } else if (form === "edit" && selectedItem) {
      update.mutate({ id: selectedItem.id, payload }, { onSuccess: closeFormSheet });
    }
  };

  const title = form === "new"
    ? t("enterprise.ewo.sheet.addTitle", "Add EWO")
    : form === "edit"
      ? t("enterprise.ewo.sheet.editTitle", "Edit EWO")
      : t("enterprise.ewo.sheet.detailTitle", "EWO Detail");

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeFormSheet()}>
      <SheetContent
        aria-describedby={undefined}
        className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[520px] lg:w-[640px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl"
      >
        <SheetHeader className="border-border border-b px-5 py-4 shrink-0">
          <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <EwoForm ref={formRef} selected={selectedItem} mode={form ?? "new"} onSubmit={handleSubmit} />
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto shrink-0">
          <Button variant="ghost" onClick={closeFormSheet}>{t("common.close", "Close")}</Button>
          <div className="flex-1" />
          <Button variant="outline" onClick={closeFormSheet} className="mr-3" disabled={isPending}>{t("common.cancel", "Cancel")}</Button>
          <Button variant="primary" onClick={() => formRef.current?.submit()} disabled={form === "details" || isPending} className="font-semibold">
            {isPending ? t("common.saving", "Saving...") : form === "new" ? t("enterprise.ewo.sheet.create", "Create EWO") : t("common.saveChanges", "Save Changes")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
