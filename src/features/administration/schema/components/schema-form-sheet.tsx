"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    sheetLoading,
    setPendingApproval,
    overrideCustomerSchema,
    overrideConfirmOpen,
    overrideChanges,
    closeOverrideConfirm,
    confirmOverride,
  } = useSchemaStore();

  const isNewMode = form === "new";
  const isCloneMode = form === "clone";
  const isDetailMode = form === "details" || form === "view_override";
  const isOverrideMode = form === "override" || form === "view_override";
  const isViewOverrideMode = form === "view_override";
  const label = activeSchemaType
    ? `${SCHEMA_TYPE_LABEL[activeSchemaType.toUpperCase()] ?? activeSchemaType} Schema`
    : "Schema";

  const title = isNewMode
    ? `Create ${label}`
    : isCloneMode
      ? `Clone ${label}`
      : form === "edit"
        ? `Edit ${label} (Draft)`
        : form === "override"
          ? `Override ${label}`
          : isViewOverrideMode
            ? `View Override — ${label}`
            : `${label} Details`;

  function handleConfirmOverride() {
    confirmOverride();
  }

  return (
    <>
      <Sheet open={schemaSheetOpen} onOpenChange={(open) => !open && closeSchemaSheet()}>
        <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[680px] lg:w-[860px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
          <SheetHeader className="border-border border-b px-5 py-4">
            <SheetTitle className="font-medium text-xl">{title}</SheetTitle>
            {isOverrideMode && overrideCustomerSchema && (
              <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                <Badge variant="info" appearance="light" className="capitalize text-xs">
                  {overrideCustomerSchema.schema_type?.replace(/_/g, " ").toLowerCase()}
                </Badge>
                <span className="text-xs text-muted-foreground truncate">
                  {overrideCustomerSchema.schema_name ?? overrideCustomerSchema.schema_id}
                </span>
                {overrideCustomerSchema.schema_version && (
                  <span className="font-mono text-[10px] text-muted-foreground/70">
                    {overrideCustomerSchema.schema_version}
                  </span>
                )}
              </div>
            )}
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
                    <Button variant="outline" onClick={() => formSubmitter?.()} className="mr-3" disabled={sheetLoading}>
                      Save as Draft
                    </Button>
                    <Button
                      variant="primary"
                      disabled={sheetLoading}
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
                    disabled={sheetLoading}
                    onClick={() => formSubmitter?.()}
                  >
                    {isCloneMode ? "Create Clone" : "Create Schema"}
                  </Button>
                )}
                {isOverrideMode && (
                  <Button
                    variant="primary"
                    className="font-semibold"
                    disabled={sheetLoading}
                    onClick={() => formSubmitter?.()}
                  >
                    Save Override
                  </Button>
                )}
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={overrideConfirmOpen} onOpenChange={(open) => !open && closeOverrideConfirm()}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Override Changes</AlertDialogTitle>
          </AlertDialogHeader>

          {overrideChanges.length === 0 ? (
            <p className="text-sm text-muted-foreground px-1">No changes detected.</p>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden text-xs">
              <div className="grid grid-cols-3 bg-muted/60 px-3 py-2 font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">
                <span>Field</span>
                <span>Before</span>
                <span>After</span>
              </div>
              <div className="divide-y divide-border max-h-64 overflow-y-auto">
                {overrideChanges.map((c) => (
                  <div key={c.field} className="grid grid-cols-3 px-3 py-2 gap-2 items-start">
                    <span className="font-medium text-foreground">{c.field}</span>
                    <span className="text-muted-foreground line-through font-mono truncate">{c.prev}</span>
                    <span className="font-mono text-blue-600 truncate">{c.next}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel onClick={closeOverrideConfirm}>Cancel</AlertDialogCancel>
            <Button variant="primary" onClick={handleConfirmOverride}>
              Confirm & Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
