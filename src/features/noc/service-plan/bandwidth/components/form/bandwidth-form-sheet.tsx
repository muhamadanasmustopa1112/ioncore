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
import { useBandwidthStore } from "../../store/bandwidth";
import { BandwidthForm, BandwidthFormRef } from "./bandwidth-form";

export function BandwidthFormSheet() {
    const { t } = useTranslation();
    const { bandwidthSheetOpen, closeBandwidthFormSheet, form, selectedBandwidth } = useBandwidthStore();
    const formRef = useRef<BandwidthFormRef>(null);

    const isNewMode = form === "new";
    const isEditMode = form === "edit";
    const isDetailMode = form === "details";

    const handleSave = () => {
        formRef.current?.submit();
    };

    return (
        <Sheet open={bandwidthSheetOpen} onOpenChange={(open) => !open && closeBandwidthFormSheet()}>
            <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
                {/* Header */}
                <SheetHeader className="border-border border-b px-5 py-4">
                    <SheetTitle className="font-medium text-xl text-primary">
                        {isNewMode ? t("nocBandwidth.form.addNewBandwidth", "Add New Bandwidth") : isEditMode ? t("nocBandwidth.form.editBandwidth", "Edit Bandwidth") : t("nocBandwidth.form.bandwidthDetails", "Bandwidth Details")}
                    </SheetTitle>
                </SheetHeader>

                {/* Body */}
                <SheetBody className="flex-1 p-0 overflow-hidden">
                    <BandwidthForm 
                        ref={formRef}
                        mode={form || "new"}
                        bandwidthCode={selectedBandwidth?.code}
                        readOnly={isDetailMode}
                    />
                </SheetBody>

                {/* Footer */}
                <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
                    <Button variant="ghost" onClick={closeBandwidthFormSheet}>
                        {t("nocBandwidth.form.close", "Close")}
                    </Button>
                    <div className="flex-1" />
                    {!isDetailMode && (
                        <>
                            <Button variant="outline" onClick={closeBandwidthFormSheet} className="mr-3">
                                {t("nocBandwidth.form.cancel", "Cancel")}
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                className="font-semibold min-w-[120px]"
                                disabled={formRef.current?.isPending}
                            >
                                {formRef.current?.isPending ? t("nocBandwidth.form.processing", "Processing...") : isNewMode ? t("nocBandwidth.form.createBandwidth", "Create Bandwidth") : t("nocBandwidth.form.saveChanges", "Save Changes")}
                            </Button>
                        </>
                    )}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
