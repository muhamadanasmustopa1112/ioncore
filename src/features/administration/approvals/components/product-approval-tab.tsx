"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useCan } from "@/lib/permissions";
import { PERMISSIONS } from "@/config/permissions";
import {
  useAdminBroadbandPlans,
  useApproveBroadbandPlan,
  useRejectBroadbandPlan,
} from "@/features/products/api/products-queries";
import type { BroadbandPlan } from "@/features/products/types/products";

export function ProductApprovalTab() {
  const { t } = useTranslation();
  const canApprove = useCan(PERMISSIONS.product.approve);
  const { data, isLoading, refetch } = useAdminBroadbandPlans({
    status: "in_review",
    per_page: 100,
  });
  const approvePlan = useApproveBroadbandPlan();
  const rejectPlan = useRejectBroadbandPlan();

  const plans = data?.broadband_plans ?? [];

  const [rejectTarget, setRejectTarget] = useState<BroadbandPlan | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [approveTarget, setApproveTarget] = useState<BroadbandPlan | null>(null);

  const busy = approvePlan.isPending || rejectPlan.isPending;

  const handleApprove = async () => {
    if (!approveTarget) return;
    try {
      await approvePlan.mutateAsync(approveTarget.id);
      setApproveTarget(null);
      await refetch();
    } catch {
      // toast from mutation
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      await rejectPlan.mutateAsync({
        id: rejectTarget.id,
        notes: rejectNotes.trim() || undefined,
      });
      setRejectTarget(null);
      setRejectNotes("");
      await refetch();
    } catch {
      // toast from mutation
    }
  };

  if (!canApprove) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t("administration.approvalCenter.noProductPermission")}
      </p>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2" />
        {t("common.loading")}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {t("administration.approvalCenter.emptyProducts")}
      </p>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("administration.approvalCenter.colName")}</TableHead>
            <TableHead>{t("administration.approvalCenter.colChannel")}</TableHead>
            <TableHead>{t("administration.approvalCenter.colPrice")}</TableHead>
            <TableHead>{t("administration.approvalCenter.colStatus")}</TableHead>
            <TableHead className="text-right">{t("administration.approvalCenter.colActions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium">{plan.name}</TableCell>
              <TableCell className="text-muted-foreground">{plan.channel || "—"}</TableCell>
              <TableCell>
                {plan.price != null
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }).format(plan.price)
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge variant="warning" appearance="light" size="sm">
                  {t("administration.productsPage.planStatusInReview", "In Review")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={busy}
                    onClick={() => setApproveTarget(plan)}
                  >
                    <RiCheckLine className="size-4 mr-1" />
                    {t("administration.approvalCenter.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={busy}
                    onClick={() => {
                      setRejectNotes("");
                      setRejectTarget(plan);
                    }}
                  >
                    <RiCloseLine className="size-4 mr-1" />
                    {t("administration.approvalCenter.reject")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!approveTarget} onOpenChange={(open) => !open && setApproveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("administration.approvalCenter.confirmApproveProduct")}</AlertDialogTitle>
            <AlertDialogDescription>{approveTarget?.name}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleApprove();
              }}
              disabled={busy}
            >
              {approvePlan.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
              {t("administration.approvalCenter.approve")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("administration.approvalCenter.confirmRejectProduct")}</AlertDialogTitle>
            <AlertDialogDescription>{rejectTarget?.name}</AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder={t("administration.approvalCenter.rejectNotesPlaceholder")}
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            className="min-h-[80px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                void handleReject();
              }}
              disabled={busy}
            >
              {rejectPlan.isPending && <Loader2 className="size-4 animate-spin mr-2" />}
              {t("administration.approvalCenter.reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
