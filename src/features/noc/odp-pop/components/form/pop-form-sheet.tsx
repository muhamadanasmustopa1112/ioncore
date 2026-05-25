"use client";

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetBody,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { usePopStore } from "../../store/pop";
import { PopForm, PopFormRef } from "./pop-form";

export function PopFormSheet() {
    const { t } = useTranslation();
    const { popSheetOpen, closePopFormSheet, form: formMode, selectedPop } = usePopStore();
    const formRef = useRef<PopFormRef>(null);

    const isNewMode = formMode === "new";
    const isEditMode = formMode === "edit";
    const isDetailMode = formMode === "details";

    const handleSave = () => {
        formRef.current?.submit();
    };

    return (
        <Sheet open={popSheetOpen} onOpenChange={(open) => !open && closePopFormSheet()}>
            <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
                {/* Header */}
                <SheetHeader className="border-border border-b px-5 py-4">
                    <SheetTitle className="font-medium text-xl">
                        {isNewMode ? t("odpPop.addNewPop", "Add New POP") : isEditMode ? t("odpPop.editPop", "Edit POP") : t("odpPop.popDetails", "POP Details")}
                    </SheetTitle>
                </SheetHeader>

                {/* Body */}
                <SheetBody className="flex-1 p-0 overflow-hidden">
                    <PopForm
                        ref={formRef}
                        mode={formMode || "new"}
                        popId={selectedPop?.id ? String(selectedPop.id) : undefined}
                        readOnly={isDetailMode}
                    />
                </SheetBody>

                {/* Footer */}
                <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
                    <Button variant="ghost" onClick={closePopFormSheet}>
                        {t("common.close")}
                    </Button>
                    <div className="flex-1" />
                    <Button variant="outline" onClick={closePopFormSheet} className="mr-3">
                        {t("common.cancel")}
                    </Button>
                    {!isDetailMode && (
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            className="font-semibold"
                            disabled={formRef.current?.isPending}
                        >
                            {isNewMode ? t("odpPop.createPop", "Create POP") : t("common.save")}
                        </Button>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
