"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLeadIngestionStore } from "../store/lead-ingestion";
import { SourceForm } from "./form/source-form";
import { MappingPanel } from "./mapping/mapping-panel";

export function LeadIngestionSheet() {
  const { sheetOpen, sheetView, form, closeSheet, selectedSource } = useLeadIngestionStore();

  const isForm = sheetView === "form";
  const isMapping = sheetView === "mapping";
  const isNew = form === "new";
  const isDetail = form === "details";

  const title = isForm
    ? isNew
      ? "Add External Source"
      : isDetail
        ? "Source Details"
        : "Edit Source"
    : `Field Mapping — ${selectedSource?.name ?? ""}`;

  const handleSave = () => {
    const submit = (window as unknown as Record<string, unknown>).__leadIngestionFormSubmit;
    if (typeof submit === "function") (submit as () => void)();
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[620px] lg:w-[760px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          {isForm && <SourceForm onSubmit={closeSheet} />}
          {isMapping && selectedSource && <MappingPanel source={selectedSource} />}
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeSheet}>
            Close
          </Button>
          <div className="flex-1" />
          {isForm && (
            <>
              <Button variant="outline" onClick={closeSheet} className="mr-3">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="font-semibold"
                disabled={isDetail}
              >
                {isNew ? "Add Source" : "Save Changes"}
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
