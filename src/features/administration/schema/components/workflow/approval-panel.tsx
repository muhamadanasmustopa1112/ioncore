"use client";

import { useState } from "react";
import { format } from "date-fns";
import { RiCheckLine, RiCheckboxCircleLine, RiCloseLine, RiTimeLine, RiSendPlaneLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Can } from "@/lib/permissions";
import { useSchemaStore } from "../../store/schema";
import {
  usePublishSchemaVersion,
  useSchema,
  useSchemaVersions,
  useVersionApproval,
  useApprovalDecisions,
  useSubmitForReview,
  useAddApprovalDecision,
} from "../../api/schema-queries";

export function ApprovalPanel() {
  const { approvalPanelOpen, closeApprovalPanel, selectedSchemaId } = useSchemaStore();
  const [comment, setComment] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [minApprovals, setMinApprovals] = useState(1);
  const [requiredApprovers, setRequiredApprovers] = useState("");
  const publishVersion = usePublishSchemaVersion();
  const submitForReview = useSubmitForReview();
  const addDecision = useAddApprovalDecision();

  const { data: schema } = useSchema(approvalPanelOpen ? selectedSchemaId : null);
  const { data: versions } = useSchemaVersions(approvalPanelOpen ? selectedSchemaId : null);

  // Priority: REVIEW/SUBMITTED > DRAFT > APPROVED. Within each, newest first.
  const sortedVersions = [...(versions ?? [])].sort((a, b) => {
    const ta = new Date(a.created_at ?? 0).getTime();
    const tb = new Date(b.created_at ?? 0).getTime();
    return tb - ta;
  });
  const isReviewStatus = (status?: string) => {
    const s = status?.toUpperCase();
    return s === "REVIEW" || s === "SUBMITTED" || s === "PENDING";
  };
  const byStatus = (s: string) =>
    sortedVersions.find((v) => v.status?.toUpperCase() === s);
  const latestDraftVersion =
    sortedVersions.find((v) => isReviewStatus(v.status))
    ?? byStatus("DRAFT")
    ?? byStatus("APPROVED")
    ?? sortedVersions[0];

  const versionStatus = latestDraftVersion?.status?.toUpperCase();
  const schemaStatus = schema?.schema_status?.toUpperCase();
  const { data: approval } = useVersionApproval(
    approvalPanelOpen ? latestDraftVersion?.id ?? null : null
  );
  // Default to empty array, but we track if we truly don't have decisions vs losing them from missing approval
  const { data: decisions = [] } = useApprovalDecisions(approvalPanelOpen ? approval?.id ?? null : null);

  const approvalStatus = approval?.status?.toUpperCase();
  const hasRejected = decisions.some((d) => d.decision?.toUpperCase() === "REJECTED");
  const approvedCount = decisions.filter((d) => d.decision?.toUpperCase() === "APPROVED").length;
  // Use known states to deduce intent, even if queries temporarily drop approval.
  const knownApprovalExists = !!approval || decisions.length > 0;
  const minRequired = approval?.min_approvals ?? minApprovals;
  const safeMinRequired = Math.max(1, minRequired);

  // Derive logical workflow status
  let workflowStatus = versionStatus;
  
  if (versionStatus !== "PUBLISHED" && versionStatus !== "ARCHIVED") {
    if (approvalStatus === "REJECTED" || hasRejected || versionStatus === "REJECTED") {
      workflowStatus = "REJECTED";
    } else if (approvalStatus === "APPROVED" || (knownApprovalExists && approvedCount >= safeMinRequired) || versionStatus === "APPROVED") {
      workflowStatus = "APPROVED";
    } else if (approvalStatus === "PENDING" || isReviewStatus(versionStatus) || knownApprovalExists) {
      workflowStatus = "REVIEW";
    }
  }

  const isDraft = workflowStatus === "DRAFT";
  const isInReview = workflowStatus === "REVIEW";
  const isRejected = workflowStatus === "REJECTED";
  const isApproved = workflowStatus === "APPROVED";

  const progressPercent = Math.min((approvedCount / safeMinRequired) * 100, 100);
  const canPublish = isApproved && !hasRejected;
  // If we have ANY sign of an approval cycle, we can't show 'Submit for review'
  const canSubmitForReview = isDraft && latestDraftVersion && !knownApprovalExists && !canPublish && !hasRejected;

  return (
    <Sheet open={approvalPanelOpen} onOpenChange={(open) => !open && closeApprovalPanel()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[560px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            Approval — {schema?.name ?? "Schema"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Approval Progress</span>
              <span className="font-medium">
                {approvedCount} / {minRequired} required
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-2 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Approver decisions list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Approval Decisions</h3>
            {decisions.length > 0 ? decisions.map((d) => {
              const isApproved = d.decision?.toUpperCase() === "APPROVED";
              const isRejected = d.decision?.toUpperCase() === "REJECTED";
              return (
                <div key={d.id} className="flex items-start gap-3 rounded-lg border p-3">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    isApproved ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : isRejected ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {isApproved ? <RiCheckLine className="h-4 w-4" /> : isRejected ? <RiCloseLine className="h-4 w-4" /> : <RiTimeLine className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{d.approver_user_id}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isApproved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : isRejected ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {d.decision.charAt(0) + d.decision.slice(1).toLowerCase()}
                      </span>
                    </div>
                    {d.comment && (
                      <p className="mt-1 text-sm text-foreground/80 italic">&ldquo;{d.comment}&rdquo;</p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(d.decided_at), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-muted-foreground">
                {isInReview ? "No decisions yet — waiting for approvers." : "Submit for review to start the approval process."}
              </p>
            )}
          </div>

          {/* Last rejection feedback (visible when back in DRAFT after a reject) */}
          {isDraft && decisions.some((d) => d.decision?.toUpperCase() === "REJECTED") && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Previously Rejected
              </p>
              {(() => {
                const lastReject = [...decisions].reverse().find((d) => d.decision?.toUpperCase() === "REJECTED");
                return lastReject ? (
                  <p className="text-xs text-foreground/80 italic">
                    &ldquo;{lastReject.comment || "(no reason given)"}&rdquo; — {lastReject.approver_user_id}
                  </p>
                ) : null;
              })()}
            </div>
          )}

          {/* Submit for Review */}
          {canSubmitForReview && (
            <div className="space-y-3 border-t pt-5">
              <h3 className="text-sm font-semibold text-foreground">Submit for Review</h3>
              <p className="text-xs text-muted-foreground">
                Send this draft version to approvers for review.
              </p>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Minimum approvals required
                </label>
                <Input
                  type="number"
                  min={1}
                  value={minApprovals}
                  onChange={(e) => setMinApprovals(Math.max(1, parseInt(e.target.value || "1", 10)))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Required approver IDs (comma-separated, optional)
                </label>
                <Input
                  placeholder="e.g. finance_mgr_id, ops_admin_id"
                  value={requiredApprovers}
                  onChange={(e) => setRequiredApprovers(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                disabled={submitForReview.isPending || minApprovals < 1}
                onClick={() => submitForReview.mutate({
                  versionId: latestDraftVersion.id,
                  payload: {
                    min_approvals: minApprovals,
                    required_approvers: requiredApprovers.trim(),
                  },
                })}
              >
                <RiSendPlaneLine className="mr-2 size-4" /> Submit for Review
              </Button>
            </div>
          )}

          {/* Your Decision */}
          {(isInReview || addDecision.isPending) && latestDraftVersion && (
            <div className="space-y-3 border-t pt-5">
              <h3 className="text-sm font-semibold text-foreground">Your Decision</h3>
              <Textarea
                placeholder="Add a comment (optional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={addDecision.isPending}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  disabled={addDecision.isPending}
                  onClick={async () => {
                    try {
                      await addDecision.mutateAsync({
                        versionId: latestDraftVersion.id,
                        payload: { decision: "REJECTED", notes: comment },
                      });
                      setComment("");
                    } catch {
                      // toast already shown by hook
                    }
                  }}
                >
                  {addDecision.isPending ? "Submitting..." : "Reject"}
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={addDecision.isPending}
                  onClick={async () => {
                    try {
                      await addDecision.mutateAsync({
                        versionId: latestDraftVersion.id,
                        payload: { decision: "APPROVED", notes: comment },
                      });
                      setComment("");
                    } catch {
                      // toast already shown by hook
                    }
                  }}
                >
                  {addDecision.isPending ? "Submitting..." : "Approve"}
                </Button>
              </div>
            </div>
          )}

          {/* Rejected state */}
          {isRejected && latestDraftVersion && (
            <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-4">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Version Rejected
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Edit the schema and resubmit a new draft for review.
              </p>
            </div>
          )}

          {/* Publish */}
          <Can permission="master.manage">
            {canPublish && (
              <div className="space-y-3 border-t border-border/50 pt-4">
                <p className="text-sm font-semibold">Publish Schema</p>
                <p className="text-xs text-muted-foreground">
                  All required approvals received. Add a change reason if needed, then publish.
                </p>
                <Input
                  placeholder="Change reason (optional)"
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="w-full font-semibold"
                  disabled={publishVersion.isPending || !latestDraftVersion}
                  onClick={() => {
                    if (latestDraftVersion) publishVersion.mutate(latestDraftVersion.id);
                  }}
                >
                  <RiCheckboxCircleLine className="mr-2 size-4" /> Publish Schema
                </Button>
              </div>
            )}
          </Can>
        </SheetBody>

        <SheetFooter className="border-border border-t p-5 pb-4">
          <Button variant="ghost" onClick={closeApprovalPanel} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
