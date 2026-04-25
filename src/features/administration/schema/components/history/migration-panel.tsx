"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchemaStore } from "../../store/schema";
import { DUMMY_SCHEMAS } from "../../data/dummy-schemas";

const AFFECTED_COUNTS: Record<string, number> = {
  "schema-bil-001": 142,
  "schema-onb-001": 215,
  "schema-svc-001": 89,
  "schema-com-001": 63,
  "schema-sus-001": 178,
};

export function MigrationPanel() {
  const { migrationPanelOpen, closeMigrationPanel, activeSchemaType } =
    useSchemaStore();

  const [fromVersionId, setFromVersionId] = useState<string>("");
  const [toVersionId, setToVersionId] = useState<string>("");

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeMigrationPanel();
      setFromVersionId("");
      setToVersionId("");
    }
  }

  const fromOptions = DUMMY_SCHEMAS.filter(
    (s) => s.schema_type === activeSchemaType,
  );

  const toOptions = DUMMY_SCHEMAS.filter(
    (s) => s.schema_type === activeSchemaType && s.id !== fromVersionId,
  );

  const showPreview = Boolean(fromVersionId && toVersionId);
  const affectedCount = AFFECTED_COUNTS[fromVersionId] ?? 0;

  function handleConfirm() {
    toast.success(`Migration queued for ${affectedCount} customers`);
    closeMigrationPanel();
    setFromVersionId("");
    setToVersionId("");
  }

  return (
    <Sheet open={migrationPanelOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[520px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            Bulk Schema Migration
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Migrate customers from one schema version to another.
          </p>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* From Schema Version */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              From Schema Version
            </label>
            <Select
              value={fromVersionId}
              onValueChange={(val) => {
                setFromVersionId(val);
                // Reset toVersionId if it would now be excluded
                if (val === toVersionId) {
                  setToVersionId("");
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select source version..." />
              </SelectTrigger>
              <SelectContent>
                {fromOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} {s.latest_version ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To Schema Version */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              To Schema Version
            </label>
            <Select
              value={toVersionId}
              onValueChange={setToVersionId}
              disabled={!fromVersionId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target version..." />
              </SelectTrigger>
              <SelectContent>
                {toOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} {s.latest_version ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preview block */}
          {showPreview && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
                  ⚠ Migration Preview
                </span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-semibold">{affectedCount} customers</span>{" "}
                will be migrated to the new schema version.
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Each migration will be logged to the audit trail.
              </p>
            </div>
          )}
        </SheetBody>

        <SheetFooter className="border-border border-t p-5 pb-4 flex flex-row gap-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => {
              closeMigrationPanel();
              setFromVersionId("");
              setToVersionId("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!fromVersionId || !toVersionId}
            onClick={handleConfirm}
          >
            Confirm Migration
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
