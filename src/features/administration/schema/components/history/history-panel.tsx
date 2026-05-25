"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { RiHistoryLine, RiGitMergeLine, RiArrowGoBackLine } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSchemaStore } from "../../store/schema";
import {
  useSchema,
  useSchemaVersions,
  useSchemaVersionDiff,
  useRollbackSchemaVersion,
} from "../../api/schema-queries";

const ROLLBACK_ELIGIBLE = ["deprecated"];

export function HistoryPanel() {
  const { t } = useTranslation();
  const {
    historyPanelOpen,
    closeHistoryPanel,
    selectedSchemaId,
  } = useSchemaStore();

  const router = useRouter();
  const [selectedVersionIds, setSelectedVersionIds] = useState<string[]>([]);
  const [rollbackTarget, setRollbackTarget] = useState<{ id: string; version: string } | null>(null);

  const { data: schema } = useSchema(historyPanelOpen ? selectedSchemaId : null);
  const { data: versionsData, isLoading: versionsLoading } = useSchemaVersions(
    historyPanelOpen ? selectedSchemaId : null
  );
  const versions = versionsData ?? [];
  const currentVersion = schema?.latest_version ?? null;

  const latestPublishedVersion = versions.find((v) => v.status.toLowerCase() === "published");

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

  const rollback = useRollbackSchemaVersion();

  function handleVersionClick(versionId: string) {
    setSelectedVersionIds((prev) => {
      if (prev.includes(versionId)) return prev.filter((id) => id !== versionId);
      if (prev.length < 2) return [...prev, versionId];
      return [prev[1], versionId];
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      closeHistoryPanel();
      setSelectedVersionIds([]);
    }
  }

  function handleConfirmRollback() {
    if (!rollbackTarget || !selectedSchemaId || !latestPublishedVersion) return;
    rollback.mutate(
      {
        id: selectedSchemaId,
        payload: {
          version: latestPublishedVersion.version,
          target_version: rollbackTarget.version,
        },
      },
      { onSuccess: () => setRollbackTarget(null) },
    );
  }

  const selectedVersions = selectedVersionIds
    .map((id) => versions.find((v) => v.id === id))
    .filter(Boolean) as (typeof versions)[number][];

  const showDiff = selectedVersions.length === 2;

  const statusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "archived":   return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
      case "approved":   return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "rejected":   return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      case "submitted":  return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
      case "draft":      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500";
      default:           return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
    }
  };

  return (
    <>
      <Sheet open={historyPanelOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[700px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
          <SheetHeader className="border-border border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <RiHistoryLine className="h-5 w-5 text-muted-foreground" />
              <SheetTitle className="font-medium text-xl">{t("administration.schema.historyTitle")}</SheetTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {t("administration.schema.historyDesc")}
            </p>
          </SheetHeader>

          <SheetBody className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="space-y-2">
              {versionsLoading && (
                <p className="text-sm text-muted-foreground">{t("administration.schema.historyLoading")}</p>
              )}
              {!versionsLoading && versions.length === 0 && (
                <p className="text-sm text-muted-foreground">{t("administration.schema.historyEmpty")}</p>
              )}
              {(() => {
                const hasPublished = versions.some((v) => v.status.toLowerCase() === "published");
                return versions.map((ver, idx) => {
                const isSelected = selectedVersionIds.includes(ver.id);
                const isLatest = idx === 0;
                const canRollback = !isLatest && ROLLBACK_ELIGIBLE.includes(ver.status.toLowerCase()) && hasPublished;
                return (
                  <div
                    key={ver.id}
                    className={`rounded-lg border transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-border bg-background"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleVersionClick(ver.id)}
                      className="w-full text-start p-3 focus:outline-none"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-mono font-bold text-sm shrink-0">{ver.version}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadgeClass(ver.status)}`}>
                            {ver.status}
                          </span>
                          {isLatest && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {t("administration.schema.historyLatest")}
                            </span>
                          )}
                          {currentVersion && ver.version === currentVersion && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {t("administration.schema.historyCurrent")}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {ver.published_at
                            ? format(new Date(ver.published_at), "dd MMM yyyy")
                            : format(new Date(ver.created_at), "dd MMM yyyy")}
                        </span>
                      </div>
                      {ver.change_reason && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ver.change_reason}</p>
                      )}
                    </button>

                    {canRollback && (
                      <div className="px-3 pb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs gap-1.5"
                          onClick={(e) => { e.stopPropagation(); setRollbackTarget({ id: ver.id, version: ver.version }); }}
                        >
                          <RiArrowGoBackLine className="size-3.5" />
                          {t("administration.schema.historyRollbackTo")} {ver.version}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              });
              })()}
            </div>

            {showDiff && (
              <div className="border border-border rounded-lg overflow-hidden mt-4">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                  <RiGitMergeLine className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {t("administration.schema.historyDiff")}: {selectedVersions[0].version} → {selectedVersions[1].version}
                  </span>
                </div>
                <div className="p-4 font-mono text-xs">
                  {diffResult?.data ? (
                    <pre className="whitespace-pre-wrap break-all text-foreground/80">
                      {JSON.stringify(diffResult.data, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground text-xs">{t("administration.schema.historyDiffLoading")}</p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  closeHistoryPanel();
                  router.push(`/administration/schema?sc_view=schema-migration&sc_migration_schema=${selectedSchemaId}`);
                }}
              >
                {t("administration.schema.historyOpenMigration")}
              </Button>
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!rollbackTarget} onOpenChange={(o) => !o && setRollbackTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("administration.schema.historyRollbackTitle")} {rollbackTarget?.version}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("administration.schema.historyRollbackDesc")}{" "}
              <span className="font-semibold text-foreground">{rollbackTarget?.version}</span>.
              {" "}{t("administration.schema.historyRollbackDesc2")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={rollback.isPending}>{t("administration.schema.historyRollbackCancel")}</AlertDialogCancel>
            <AlertDialogAction
              disabled={rollback.isPending}
              onClick={handleConfirmRollback}
            >
              {rollback.isPending ? t("administration.schema.historyRollingBack") : t("administration.schema.historyRollbackConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
