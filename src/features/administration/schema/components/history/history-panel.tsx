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
import { useSchemaVersions, useSchemaVersionDiff } from "../../api/schema-queries";


export function HistoryPanel() {
  const {
    historyPanelOpen,
    closeHistoryPanel,
    selectedSchemaId,
    openMigrationPanel,
  } = useSchemaStore();

  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);

  const { data: versionsData, isLoading: versionsLoading } = useSchemaVersions(
    historyPanelOpen ? selectedSchemaId : null
  );
  const versions = versionsData ?? [];

  const diffV1 = selectedVersionIds[0]
    ? versions.find((v) => v.id === selectedVersionIds[0])?.version
    : undefined;
  const diffV2 = selectedVersionIds[1]
    ? versions.find((v) => v.id === selectedVersionIds[1])?.version
    : undefined;

  const { data: diffResult } = useSchemaVersionDiff(
    diffV1 && diffV2 ? selectedSchemaId : null,
    diffV1 ?? "",
    diffV2 ?? ""
  );

  function handleVersionClick(versionId: string) {
    setSelectedVersionIds((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId);
      }
      if (prev.length < 2) {
        return [...prev, versionId];
      }
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
    switch (status.toLowerCase()) {
      case "published":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "archived":
        return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
      case "approved":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "submitted":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
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
              Version History
            </SheetTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Select up to 2 versions to compare changes.
          </p>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Version list */}
          <div className="space-y-2">
            {versionsLoading && (
              <p className="text-sm text-muted-foreground">Loading versions...</p>
            )}
            {!versionsLoading && versions.length === 0 && (
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
                        {ver.version}
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
                  Diff: {selectedVersions[0].version} → {selectedVersions[1].version}
                </span>
              </div>
              <div className="p-4 font-mono text-xs">
                {diffResult?.data
                  ? (
                    <pre className="whitespace-pre-wrap break-all text-foreground/80">
                      {JSON.stringify(diffResult.data, null, 2)}
                    </pre>
                  )
                  : (
                    <p className="text-muted-foreground text-xs">Loading diff...</p>
                  )}
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
