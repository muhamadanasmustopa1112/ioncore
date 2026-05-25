"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { schemaKeys } from "../../api/schema-queries";
import { format } from "date-fns";
import { RiCheckLine, RiCheckboxCircleLine, RiCloseLine, RiEditLine, RiTimeLine, RiSendPlaneLine } from "@remixicon/react";
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
import { useAuthStore } from "@/store/auth-store";
import { useSchemaStore } from "../../store/schema";
import {
  usePublishSchemaVersion,
  useSchema,
  useSchemaVersions,
  useSchemaVersion,
  useVersionApproval,
  useApprovalDecisions,
  useSubmitForReview,
  useAddApprovalDecision,
} from "../../api/schema-queries";

export function ApprovalPanel() {
  const { t } = useTranslation();
  const { approvalPanelOpen, closeApprovalPanel, selectedSchemaId } = useSchemaStore();
  const currentUserId = useAuthStore((s) => s.user?.id ?? "");
  const currentUserName = useAuthStore((s) => s.user?.fullName ?? "");
  const [comment, setComment] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [minApprovals, setMinApprovals] = useState(1);
  const [requiredApprovers, setRequiredApprovers] = useState("");
  const [hasDecided, setHasDecided] = useState(false);
  const publishVersion = usePublishSchemaVersion();
  const submitForReview = useSubmitForReview();
  const addDecision = useAddApprovalDecision();

  const qc = useQueryClient();

  // Force fresh versions every time the panel opens so stale cache
  // (e.g. list without the new draft created after a rejection) never bleeds in.
  useEffect(() => {
    if (approvalPanelOpen && selectedSchemaId) {
      qc.invalidateQueries({ queryKey: schemaKeys.versions(selectedSchemaId) });
      qc.removeQueries({ queryKey: ["schema-approval"], exact: false });
      qc.removeQueries({ queryKey: ["schema-approval-decisions"], exact: false });
      setHasDecided(false);
    }
  }, [approvalPanelOpen, selectedSchemaId, qc]);

  const { data: schema, isLoading: isSchemaLoading } = useSchema(approvalPanelOpen ? selectedSchemaId : null);
  const { data: versions, isLoading: isVersionsLoading } = useSchemaVersions(approvalPanelOpen ? selectedSchemaId : null);
  const isLoadingData = approvalPanelOpen && (isSchemaLoading || isVersionsLoading);

  const isReviewStatus = (status?: string) => {
    const s = status?.toUpperCase();
    return s === "REVIEW" || s === "SUBMITTED" || s === "PENDING";
  };

  // Newest version is always index 0 — use it directly
  const latestDraftVersion = versions?.[0] ?? null;
  // Rollback version: the one matching schema.latest_version (e.g. "v1.1"), not versions[0]
  const rollbackVersion = schema?.latest_version
    ? (versions?.find((v) => v.version === schema.latest_version) ?? null)
    : null;

  const { data: liveVersion } = useSchemaVersion(
    approvalPanelOpen ? latestDraftVersion?.id ?? null : null
  );
  const versionStatus = (liveVersion?.status ?? latestDraftVersion?.status)?.toUpperCase();
  // latestDraftVersion.status (versions list) is more reliable than liveVersion (single endpoint can lag).
  // schema.schema_status is empty on single-schema endpoint, so use all three signals.
  const isRollback =
    versionStatus === "ROLLBACK" ||
    latestDraftVersion?.status?.toUpperCase() === "ROLLBACK" ||
    schema?.schema_status?.toUpperCase() === "ROLLBACK";
  const { data: approvalRaw } = useVersionApproval(
    approvalPanelOpen ? latestDraftVersion?.id ?? null : null
  );
  // Guard: only trust approval if it belongs to the current version.
  // placeholderData keeps stale published-version approval alive when a new draft
  // is created, which falsely pushes workflowStatus to "REVIEW".
  const approval = approvalRaw?.schema_version_id === latestDraftVersion?.id ? approvalRaw : null;

  // Stable refs — prevent decisions query from going disabled during refetch.
  // Reset both when schema OR version changes so stale approval data from a previous
  // schema / approval cycle never bleeds into a fresh Draft.
  const stableApprovalIdRef = useRef<string | null>(null);
  const stableVersionIdRef = useRef<string | null>(null);
  const stableSchemaIdRef = useRef<string | null>(null);
  const currentVersionId = latestDraftVersion?.id ?? null;
  if (selectedSchemaId !== stableSchemaIdRef.current) {
    stableSchemaIdRef.current = selectedSchemaId;
    stableVersionIdRef.current = null;
    stableApprovalIdRef.current = null;
  }
  if (currentVersionId !== stableVersionIdRef.current) {
    stableVersionIdRef.current = currentVersionId;
    stableApprovalIdRef.current = null;
  }
  if (approval?.id) stableApprovalIdRef.current = approval.id;
  const stableApprovalId = stableApprovalIdRef.current;

  const { data: fetchedDecisions = [] } = useApprovalDecisions(approvalPanelOpen ? stableApprovalId : null);
  // Prefer embedded decisions from approval response (fresher, no extra round-trip)
  const decisions = (approval?.decisions ?? fetchedDecisions);

  const approvalStatus = approval?.status?.toUpperCase();
  const hasRejected = decisions.some((d) => d.decision?.toUpperCase() === "REJECTED");
  const approvedCount = decisions.filter((d) => d.decision?.toUpperCase() === "APPROVED").length;
  const minRequired = approval?.min_approvals ?? minApprovals;
  const safeMinRequired = Math.max(1, minRequired);

  // Derive logical workflow status.
  // versionStatus from the BE single-version endpoint is ground truth.
  // Only override when there is evidence of an ACTIVE approval cycle for this version.
  // A DRAFT version with no pending approval must stay DRAFT regardless of stale cache.
  let workflowStatus = versionStatus;
  if (versionStatus !== "PUBLISHED" && versionStatus !== "ARCHIVED") {
    if (approvalStatus === "REJECTED" || hasRejected || versionStatus === "REJECTED") {
      workflowStatus = "REJECTED";
    } else if (
      versionStatus === "APPROVED" ||
      (versionStatus !== "DRAFT" && (approvalStatus === "APPROVED" || approvedCount >= safeMinRequired))
    ) {
      workflowStatus = "APPROVED";
    } else if (approvalStatus === "PENDING" || isReviewStatus(versionStatus) || !!stableApprovalId) {
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
  const canSubmitForReview = isDraft && latestDraftVersion && !stableApprovalId && !canPublish && !hasRejected;

  const alreadyDecided = hasDecided || decisions.some((d) => d.approver_user_id === currentUserId);
  const canDecide = !alreadyDecided;

  return (
    <Sheet open={approvalPanelOpen} onOpenChange={(open) => !open && closeApprovalPanel()}>
      <SheetContent className="inset-y-8 lg:end-10 start-auto h-full max-h-[calc(100vh-64px)] gap-0 rounded-lg border p-0 sm:max-w-none lg:w-[560px] flex flex-col [&_[data-slot=sheet-close]]:end-5 [&_[data-slot=sheet-close]]:top-4.5 shadow-2xl">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-medium text-xl">
            {isRollback ? t("administration.schema.approvalTitleRollback") : isDraft ? t("administration.schema.approvalTitleDraft") : isInReview ? t("administration.schema.approvalTitleInReview") : isRejected ? t("administration.schema.approvalTitleRejected") : t("administration.schema.approvalTitle")} — {schema?.name ?? "Schema"}
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="flex-1 overflow-y-auto p-5 space-y-6">
          {isLoadingData ? (
            <div className="flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground">
              <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
              {t("administration.schema.approvalLoading")}
            </div>
          ) : (<>
          {/* Progress — shown when there are decisions (including in-review partial approvals) */}
          {!isRollback && (isApproved || isRejected || (isInReview && decisions.length > 0)) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("administration.schema.approvalProgress")}</span>
                <span className="font-medium">{approvedCount} / {minRequired} {t("administration.schema.approvalRequired")}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}

          {/* Approver decisions list — shown when decisions exist (including partial in-review) */}
          {!isRollback && (isApproved || isRejected || (isInReview && decisions.length > 0)) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t("administration.schema.approvalDecisions")}</h3>
              {decisions.length > 0 ? decisions.map((d) => {
                const isDecisionApproved = d.decision?.toUpperCase() === "APPROVED";
                const isDecisionRejected = d.decision?.toUpperCase() === "REJECTED";
                return (
                  <div key={d.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isDecisionApproved ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : isDecisionRejected ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}>
                      {isDecisionApproved ? <RiCheckLine className="h-4 w-4" /> : isDecisionRejected ? <RiCloseLine className="h-4 w-4" /> : <RiTimeLine className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">
                          {d.approver_name
                            ? d.approver_name
                            : d.approver_user_id === currentUserId
                              ? currentUserName || "You"
                              : "••••••••"}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isDecisionApproved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : isDecisionRejected ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
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
                <p className="text-sm text-muted-foreground">{t("administration.schema.approvalNoDecisions")}</p>
              )}
            </div>
          )}

          {/* Last rejection feedback (visible when back in DRAFT after a reject) */}
          {isDraft && decisions.some((d) => d.decision?.toUpperCase() === "REJECTED") && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                {t("administration.schema.approvalPreviouslyRejected")}
              </p>
              {(() => {
                const lastReject = [...decisions].reverse().find((d) => d.decision?.toUpperCase() === "REJECTED");
                return lastReject ? (
                  <p className="text-xs text-foreground/80 italic">
                    &ldquo;{lastReject.comment || t("administration.schema.approvalNoReason")}&rdquo; — {lastReject.approver_user_id}
                  </p>
                ) : null;
              })()}
            </div>
          )}

          {/* Submit for Review */}
          {canSubmitForReview && (
            <div className="space-y-3 border-t pt-5">
              <h3 className="text-sm font-semibold text-foreground">{t("administration.schema.submitForReview")}</h3>
              <p className="text-xs text-muted-foreground">
                {t("administration.schema.submitForReviewDesc")}
              </p>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("administration.schema.minApprovalsRequired")}
                </label>
                <Input
                  type="number"
                  min={1}
                  value={minApprovals}
                  onChange={(e) => setMinApprovals(Math.max(1, parseInt(e.target.value || "1", 10)))}
                />
              </div>
              {/* <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Required approver IDs (comma-separated, optional)
                </label>
                <Input
                  placeholder="e.g. finance_mgr_id, ops_admin_id"
                  value={requiredApprovers}
                  onChange={(e) => setRequiredApprovers(e.target.value)}
                />
              </div> */}
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
                <RiSendPlaneLine className="mr-2 size-4" /> {t("administration.schema.submitForReviewBtn")}
              </Button>
            </div>
          )}

          {/* Your Decision */}
          {(isInReview || addDecision.isPending) && latestDraftVersion && (
            <Can
              permission="schema.approve"
              fallback={
                <div className="border-t pt-5">
                  <p className="text-sm text-muted-foreground">
                    {t("administration.schema.awaitingApprover")}
                  </p>
                </div>
              }
            >
            <div className="space-y-3 border-t pt-5">
              <h3 className="text-sm font-semibold text-foreground">{t("administration.schema.yourDecision")}</h3>
              {!canDecide ? (
                <p className="text-sm text-muted-foreground">
                  {t("administration.schema.alreadyDecided")}
                </p>
              ) : (
                <>
                  <Textarea
                    placeholder={t("administration.schema.commentPlaceholder")}
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
                          setHasDecided(true);
                        } catch {
                          // toast already shown by hook
                        }
                      }}
                    >
                      {addDecision.isPending ? t("administration.schema.submitting") : t("administration.schema.reject")}
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
                          setHasDecided(true);
                        } catch {
                          // toast already shown by hook
                        }
                      }}
                    >
                      {addDecision.isPending ? t("administration.schema.submitting") : t("administration.schema.approve")}
                    </Button>
                  </div>
                </>
              )}
            </div>
            </Can>
          )}

          {/* Rejected state */}
          {isRejected && latestDraftVersion && (
            <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  {t("administration.schema.versionRejected")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("administration.schema.versionRejectedDesc")}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  // closeApprovalPanel() nullifies selectedSchemaId — transition atomically instead
                  useSchemaStore.setState({ approvalPanelOpen: false, schemaSheetOpen: true, form: "edit" });
                }}
              >
                <RiEditLine className="mr-2 size-4" /> {t("administration.schema.editSchema")}
              </Button>
            </div>
          )}

          {/* Rollback — direct publish, no approval needed */}
          {isRollback && rollbackVersion && (
            <Can permission="master.manage">
              <div className="space-y-3 border-t border-border/50 pt-4">
                <p className="text-sm font-semibold">{t("administration.schema.publishRollback")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("administration.schema.publishRollbackDesc")}
                </p>
                <Button
                  variant="primary"
                  className="w-full font-semibold"
                  disabled={publishVersion.isPending}
                  onClick={() => publishVersion.mutate(rollbackVersion.id)}
                >
                  <RiCheckboxCircleLine className="mr-2 size-4" /> {t("administration.schema.publishRollbackBtn")}
                </Button>
              </div>
            </Can>
          )}

          {/* Publish */}
          <Can permission="master.manage">
            {!isRollback && canPublish && (
              <div className="space-y-3 border-t border-border/50 pt-4">
                <p className="text-sm font-semibold">{t("administration.schema.publishSchema")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("administration.schema.publishSchemaDesc")}
                </p>
                <Input
                  placeholder={t("administration.schema.changeReasonPlaceholder")}
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
                  <RiCheckboxCircleLine className="mr-2 size-4" /> {t("administration.schema.publishSchemaBtn")}
                </Button>
              </div>
            )}
          </Can>
          </>)}
        </SheetBody>

        <SheetFooter className="border-border border-t p-5 pb-4">
          <Button variant="ghost" onClick={closeApprovalPanel} className="w-full">
            {t("administration.schema.close")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
