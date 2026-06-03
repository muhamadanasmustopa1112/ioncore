"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useSuspensionStore } from "../../store/suspension";
import { useApproveSuspension } from "../../api/approve-suspension";
import { useRestoreSuspension } from "../../api/restore-suspension";
import { useSchemaVersion } from "@/features/administration/schema/api/schema-queries";
import type { AppliedSuspensionRules } from "../../types";

export function SuspensionDetailSheet() {
  const { t } = useTranslation();
  const {
    formMode,
    suspensionSheetOpen,
    selectedSuspension,
    closeSuspensionSheet,
  } = useSuspensionStore();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);

  const { mutate: approveSuspension, isPending: isApproving } =
    useApproveSuspension({
      mutationConfig: { onSuccess: closeSuspensionSheet },
    });

  const { mutate: restoreSuspension, isPending: isRestoring } =
    useRestoreSuspension({
      mutationConfig: { onSuccess: closeSuspensionSheet },
    });

  if (!selectedSuspension) return null;

  const { data: schemaVersion } = useSchemaVersion(
    selectedSuspension.suspensionSchemaVersionId ?? null
  );

  const schemaName = selectedSuspension.suspensionSchemaName || schemaVersion?.id || "—";
  const schemaVersionLabel = selectedSuspension.suspensionSchemaVersion || schemaVersion?.version || "—";
  const rules = (schemaVersion?.content as AppliedSuspensionRules | null) ?? selectedSuspension.appliedSchemaRules;
  const approvalChain = selectedSuspension.approvalChain;

  return (
    <>
      <Sheet open={suspensionSheetOpen} onOpenChange={closeSuspensionSheet}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{t("billing.suspension.suspensionDetail", "Suspension Detail")}</SheetTitle>
            <SheetDescription>
              {selectedSuspension.customerName} — {selectedSuspension.invoiceNumber}
            </SheetDescription>
          </SheetHeader>

          <div className="py-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">{t("billing.suspension.customer")}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Name</span>
                  <p className="font-medium">{selectedSuspension.customerName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type</span>
                  <p className="font-medium capitalize">{selectedSuspension.customerType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Branch</span>
                  <p className="font-medium">{selectedSuspension.branch}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Overdue</span>
                  <p className="font-medium">{selectedSuspension.overdueDays} days</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-semibold mb-2">{t("billing.schema.schema", "Schema")}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Name</span>
                  <p className="font-medium">{schemaName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Version</span>
                  <p className="font-medium">{schemaVersionLabel}</p>
                </div>
                {rules && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Auto-Suspend</span>
                      <p>
                        <Badge variant={rules.autoSuspend ? "destructive" : "outline"} className="capitalize">
                          {rules.autoSuspend ? "Yes" : "Manual"}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ION Radius Action</span>
                      <p>
                        <Badge variant="outline" className="capitalize">
                          {rules.ionRadiusAction?.replace("_", " ") || "—"}
                        </Badge>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {approvalChain && approvalChain.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">{t("billing.suspension.approvalChain", "Approval Chain")}</h4>
                  <div className="space-y-2">
                    {approvalChain.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                        <div>
                          <p className="font-medium">{entry.role}</p>
                          {entry.approver && <p className="text-xs text-muted-foreground">{entry.approver}</p>}
                        </div>
                        <Badge
                          variant={
                            entry.status === "approved"
                              ? "success"
                              : entry.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                          className="capitalize"
                        >
                          {entry.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h4 className="text-sm font-semibold mb-2">{t("common.status")}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Status</span>
                  <p>
                    <Badge variant="primary" className="capitalize">
                      {t(`billing.suspension.statuses.${selectedSuspension.status}`)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Approved By</span>
                  <p className="font-medium">{selectedSuspension.approvedBy || "—"}</p>
                </div>
                {selectedSuspension.suspensionDate && (
                  <div>
                    <span className="text-muted-foreground">Suspended</span>
                    <p className="font-medium">{selectedSuspension.suspensionDate}</p>
                  </div>
                )}
                {selectedSuspension.restoredDate && (
                  <div>
                    <span className="text-muted-foreground">Restored</span>
                    <p className="font-medium">{selectedSuspension.restoredDate}</p>
                  </div>
                )}
              </div>
            </div>

            {selectedSuspension.reason && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-semibold mb-2">{t("billing.suspension.reason", "Reason")}</h4>
                  <p className="text-sm text-muted-foreground">{selectedSuspension.reason}</p>
                </div>
              </>
            )}
          </div>

          <SheetFooter className="flex-col gap-2 sm:flex-col">
            {selectedSuspension.status === "pending" && (
              <Button
                variant="destructive"
                onClick={() => setShowApproveDialog(true)}
                disabled={isApproving}
                className="w-full"
              >
                {isApproving ? "Approving..." : t("billing.suspension.approveAndSuspend", "Approve & Suspend")}
              </Button>
            )}
            {selectedSuspension.status === "suspended" && (
              <Button
                variant="primary"
                onClick={() => setShowRestoreDialog(true)}
                disabled={isRestoring}
                className="w-full"
              >
                {isRestoring ? "Restoring..." : t("billing.suspension.restoreService", "Restore Service")}
              </Button>
            )}
            <Button variant="outline" onClick={closeSuspensionSheet} className="w-full">
              {t("billing.common.close")}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("billing.suspension.approveSuspension", "Approve Suspension?")}</AlertDialogTitle>
            <AlertDialogDescription>
              This will suspend service for &quot;{selectedSuspension.customerName}&quot;.
              ION Radius state: ACTIVE → SUSPENDED.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isApproving}>{t("billing.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                approveSuspension({ id: selectedSuspension.id });
                setShowApproveDialog(false);
              }}
              disabled={isApproving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isApproving ? "Approving..." : t("billing.suspension.approveAndSuspend", "Approve & Suspend")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("billing.suspension.restoreService", "Restore Service?")}</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore service for &quot;{selectedSuspension.customerName}&quot;.
              ION Radius state: SUSPENDED → ACTIVE.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRestoring}>{t("billing.common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                restoreSuspension({ id: selectedSuspension.id });
                setShowRestoreDialog(false);
              }}
              disabled={isRestoring}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isRestoring ? "Restoring..." : t("billing.suspension.restoreService", "Restore Service")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
