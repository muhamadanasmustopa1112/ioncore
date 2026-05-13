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
import { useSchemaStore } from "../store/schema";
import { SchemaBuilder } from "./builder/schema-builder";
import { SCHEMA_TYPE_LABEL } from "../types/schema-type-constants";

export function SchemaFormSheet() {
  const {
    schemaSheetOpen,
    closeSchemaSheet,
    form,
    activeSchemaType,
    formSubmitter,
    setPendingApproval,
  } = useSchemaStore();
  const isNewMode = form === "new";
  const isCloneMode = form === "clone";
  const isDetailMode = form === "details";
  const label = activeSchemaType
    ? `${SCHEMA_TYPE_LABEL[activeSchemaType.toUpperCase()] ?? activeSchemaType} Schema`
    : "Schema";

  return (
    <Sheet open={schemaSheetOpen} onOpenChange={(open) => !open && closeSchemaSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[680px] lg:w-[860px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isNewMode
              ? `Create ${label}`
              : isCloneMode
                ? `Clone ${label}`
                : form === "edit"
                  ? `Edit ${label} (Draft)`
                  : `${label} Details`}
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="flex-1 p-0 overflow-hidden">
          <SchemaBuilder />
        </SheetBody>
        <SheetFooter className="border-border flex-row gap-2.5 border-t p-5 pb-4 lg:gap-0 mt-auto">
          <Button variant="ghost" onClick={closeSchemaSheet}>
            Close
          </Button>
          <div className="flex-1" />
          {!isDetailMode && (
            <>
              <Button variant="outline" onClick={closeSchemaSheet} className="mr-3">
                Cancel
              </Button>
              {form === "edit" && (
                <>
                  <Button variant="outline" onClick={() => formSubmitter?.()} className="mr-3">
                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setPendingApproval(true);
                      formSubmitter?.();
                    }}
                  >
                    Submit for Approval
                  </Button>
                </>
              )}
              {(isNewMode || isCloneMode) && (
                <Button
                  variant="primary"
                  className="font-semibold"
                  onClick={() => formSubmitter?.()}
                >
                  {isCloneMode ? "Create Clone" : "Create Schema"}
                </Button>
              )}
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
