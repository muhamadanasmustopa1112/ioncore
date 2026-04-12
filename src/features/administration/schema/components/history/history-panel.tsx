"use client";

import { useState } from "react";
import { format } from "date-fns";
import { RiHistoryLine, RiGitMergeLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSchemaStore } from "../../store/schema";
import { DUMMY_SCHEMA_VERSIONS, DUMMY_SCHEMAS } from "../../data/dummy-schemas";

type DiffLine = {
  type: "added" | "changed";
  text: string;
};

const PLACEHOLDER_DIFF: DiffLine[] = [
  { type: "changed", text: 'billing_cycle.type: "monthly" → "quarterly"' },
  { type: "changed", text: "recurring_payment.late_fee.value: 1 → 2" },
  { type: "added", text: "otc.generate_faktur_pajak: true" },
];

export function HistoryPanel() {
  const {
    historyPanelOpen,
    closeHistoryPanel,
    selectedSchemaId,
    openMigrationPanel,
  } = useSchemaStore();

  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);

  const schema = DUMMY_SCHEMAS.find((s) => s.id === selectedSchemaId);

  const versions = DUMMY_SCHEMA_VERSIONS.filter(
    (v) =>
      schema &&
      v.name === schema.name &&
      v.customer_type === schema.customer_type,
  );

  function handleVersionClick(versionId: string) {
    setSelectedVersionIds((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId);
      }
      if (prev.length < 2) {
        return [...prev, versionId];
      }
      // Replace oldest (first) with new selection
      return [prev[1], versionId];
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeHistoryPanel();
      setSelectedVersionIds([]);
    }
  }

  const selectedVersions = selectedVersionIds
    .map((id) => versions.find((v) => v.id === id))
    .filter(Boolean) as (typeof versions)[number][];

  const showDiff = selectedVersions.length === 2;

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "archived":
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
      case "draft":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500";
      default:
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  return (
    <Sheet open={historyPanelOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <RiHistoryLine className="h-5 w-5 text-muted-foreground" />
            <SheetTitle className="font-medium text-xl">
              Version History — {schema?.name ?? "Schema"}
            </SheetTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Select up to 2 versions to compare changes.
          </p>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Version list */}
          <div className="space-y-2">
            {versions.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No version history found for this schema.
              </p>
            )}
            {versions.map((ver) => {
              const isSelected = selectedVersionIds.includes(ver.id);
              return (
                <button
                  key={ver.id}
                  type="button"
                  onClick={() => handleVersionClick(ver.id)}
                  className={`w-full text-start rounded-lg border p-3 transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-sm shrink-0">
                        v{ver.version}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadgeClass(ver.status)}`}
                      >
                        {ver.status}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {ver.published_at
                        ? format(new Date(ver.published_at), "dd MMM yyyy")
                        : format(new Date(ver.created_at), "dd MMM yyyy")}
                    </span>
                  </div>
                  {ver.change_reason && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      {ver.change_reason}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Diff section */}
          {showDiff && (
            <div className="border border-border rounded-lg overflow-hidden mt-4">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <RiGitMergeLine className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  Diff: v{selectedVersions[0].version} → v{selectedVersions[1].version}
                </span>
              </div>
              <div className="p-4 space-y-2 font-mono text-xs">
                {PLACEHOLDER_DIFF.map((line, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded ${
                      line.type === "added"
                        ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                    }`}
                  >
                    {line.type === "added" ? "+ " : "~ "}
                    {line.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open Migration Tool button */}
          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                closeHistoryPanel();
                openMigrationPanel();
              }}
            >
              Open Migration Tool
            </Button>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
