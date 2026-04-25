"use client";

import { useState } from "react";
import { RiCheckLine, RiCloseLine, RiTimeLine } from "@remixicon/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDuplicateReviewStore } from "../../store/duplicate-review";
import { LeadCompareCard } from "./lead-compare-card";

export function ReviewSheet() {
  const { sheetOpen, selectedPair, closeSheet, resolvePair } = useDuplicateReviewStore();
  const [masterId, setMasterId] = useState<string | null>(null);

  const pair = selectedPair;
  const isPending = pair?.status === "pending" || pair?.status === "deferred";

  const handleMerge = () => {
    if (!pair || !masterId) {
      toast.error("Select master record before merging");
      return;
    }
    resolvePair(pair.id, "merged", masterId);
    toast.success("Leads merged — duplicate archived");
  };

  const handleDismiss = () => {
    if (!pair) return;
    resolvePair(pair.id, "dismissed");
    toast.success("Pair dismissed — marked as distinct leads");
  };

  const handleDefer = () => {
    if (!pair) return;
    resolvePair(pair.id, "deferred");
    toast.info("Pair deferred for later review");
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={(o) => !o && closeSheet()}>
      <SheetContent className="inset-y-0 sm:inset-y-8 lg:end-10 start-auto h-full sm:max-h-[calc(100vh-64px)] gap-0 sm:rounded-lg border p-0 sm:max-w-none w-full md:w-[700px] lg:w-[860px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <div className="flex items-center justify-between gap-4 pr-8">
            <SheetTitle className="font-medium text-xl">
              Review Duplicate Pair
            </SheetTitle>
            {pair && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Match score:</span>
                <span className={`text-sm font-bold ${
                  pair.similarityScore >= 90
                    ? "text-red-600 dark:text-red-400"
                    : pair.similarityScore >= 80
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground"
                }`}>
                  {pair.similarityScore}%
                </span>
                <div className="flex gap-1">
                  {pair.matchReasons.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground capitalize"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetHeader>

        <SheetBody className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full px-5 py-5">
            {pair && (
              <div className="space-y-5">
                {isPending && (
                  <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700">
                    Select a <strong>master record</strong> to keep. The other will be archived and linked to it. Status resets to <strong>new</strong> on the master after merge.
                  </div>
                )}

                {pair.status === "merged" && (
                  <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                    Merged — master record: <strong>{pair.masterId === pair.leadA.id ? pair.leadA.lead_name : pair.leadB.lead_name}</strong>.
                    Resolved {pair.resolvedAt ? new Date(pair.resolvedAt).toLocaleString("id-ID") : ""} by {pair.resolvedBy}.
                  </div>
                )}

                {isPending && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Select master record (the one to keep)
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[pair.leadA, pair.leadB].map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => setMasterId(lead.id)}
                          className={`rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                            masterId === lead.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium">{lead.lead_name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">({lead.branch_name})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <LeadCompareCard
                    lead={pair.leadA}
                    label="Record A"
                    isMaster={masterId === pair.leadA.id || pair.masterId === pair.leadA.id}
                    matchReasons={pair.matchReasons}
                  />
                  <LeadCompareCard
                    lead={pair.leadB}
                    label="Record B"
                    isMaster={masterId === pair.leadB.id || pair.masterId === pair.leadB.id}
                    matchReasons={pair.matchReasons}
                  />
                </div>
              </div>
            )}
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="border-border flex-row gap-2 border-t p-5 pb-4 mt-auto flex-wrap">
          <Button variant="ghost" onClick={closeSheet}>
            Close
          </Button>
          <div className="flex-1" />
          {isPending && (
            <>
              <Button variant="outline" onClick={handleDefer} className="gap-1.5">
                <RiTimeLine className="size-4" />
                Defer
              </Button>
              <Button variant="outline" onClick={handleDismiss} className="gap-1.5 text-slate-600">
                <RiCloseLine className="size-4" />
                Dismiss
              </Button>
              <Button
                variant="primary"
                onClick={handleMerge}
                disabled={!masterId}
                className="gap-1.5 font-semibold"
              >
                <RiCheckLine className="size-4" />
                Merge
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
