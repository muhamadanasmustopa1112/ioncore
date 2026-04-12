"use client";

import { useState } from "react";
import { format } from "date-fns";
import { RiCheckLine, RiCheckboxCircleLine, RiCloseLine, RiTimeLine } from "@remixicon/react";
import { toast } from "sonner";
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
import { useSchemaStore } from "../../store/schema";
import { DUMMY_APPROVALS, DUMMY_APPROVAL_DECISIONS } from "../../data/dummy-approvals";
import { DUMMY_SCHEMAS } from "../../data/dummy-schemas";

export function ApprovalPanel() {
  const { approvalPanelOpen, closeApprovalPanel, selectedSchemaId } = useSchemaStore();
  const [comment, setComment] = useState("");
  const [changeReason, setChangeReason] = useState("");

  const schema = DUMMY_SCHEMAS.find((s) => s.id === selectedSchemaId);
  const approval = DUMMY_APPROVALS.find((a) => a.schema_id === selectedSchemaId);
  const decisions = approval
    ? DUMMY_APPROVAL_DECISIONS.filter((d) => d.schema_approval_id === approval.id)
    : [];

  const approvedCount = decisions.filter((d) => d.decision === "approved").length;
  const minRequired = approval?.min_approvals ?? 0;
  const progressPercent = minRequired > 0 ? Math.min((approvedCount / minRequired) * 100, 100) : 0;

  const decidedRoles = new Set(
    decisions.map((d) => d.approver_role)
  );

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

          {/* Approver list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Required Approvers</h3>
            {approval?.required_approvers.map((roleId) => {
              const decision = decisions.find((d) => {
                // Match by role name derived from roleId (e.g. "role-product-admin" → "Product Admin")
                const roleName = roleId
                  .replace("role-", "")
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                return d.approver_role === roleName;
              });

              if (decision) {
                const isApproved = decision.decision === "approved";
                return (
                  <div
                    key={roleId}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        isApproved
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {isApproved ? (
                        <RiCheckLine className="h-4 w-4" />
                      ) : (
                        <RiCloseLine className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{decision.approver_name}</span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {isApproved ? "Approved" : "Rejected"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{decision.approver_role}</p>
                      {decision.comment && (
                        <p className="mt-1 text-sm text-foreground/80 italic">
                          &ldquo;{decision.comment}&rdquo;
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {format(new Date(decision.decided_at), "dd MMM yyyy, HH:mm")}
                      </p>
                    </div>
                  </div>
                );
              }

              // Pending — no decision yet
              const roleName = roleId
                .replace("role-", "")
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              return (
                <div
                  key={roleId}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    <RiTimeLine className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        {roleName}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Pending
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting decision</p>
                  </div>
                </div>
              );
            })}

            {!approval && (
              <p className="text-sm text-muted-foreground">
                No approval workflow found for this schema.
              </p>
            )}
          </div>

          {/* Your Decision */}
          <div className="space-y-3 border-t pt-5">
            <h3 className="text-sm font-semibold text-foreground">Your Decision</h3>
            <Textarea
              placeholder="Add a comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                onClick={() => {
                  setComment("");
                  closeApprovalPanel();
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setComment("");
                  closeApprovalPanel();
                }}
              >
                Approve
              </Button>
            </div>
          </div>

          {/* Publish */}
          {approval?.status === "approved" && (
            <div className="space-y-3 border-t border-border/50 pt-4">
              <p className="text-sm font-semibold">Publish Schema</p>
              <p className="text-xs text-muted-foreground">
                All required approvals received. Enter a change reason and publish.
              </p>
              <Input
                placeholder="Change reason (required, min 10 chars)"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
              />
              <Button
                variant="primary"
                className="w-full font-semibold"
                disabled={changeReason.length < 10}
                onClick={() => {
                  toast.success(`Schema published with reason: "${changeReason}"`);
                  closeApprovalPanel();
                }}
              >
                <RiCheckboxCircleLine className="mr-2 size-4" /> Publish Schema
              </Button>
            </div>
          )}
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
