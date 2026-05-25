"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useProcessNOCApproval } from "../../../api/noc";
import { RadiusCredentialsPanel } from "../radius-credentials-panel";
import { ModalShell, FieldLabel } from "./shell";

type Decision = "approved" | "rejected";

export function NOCApprovalModal({
  workOrderId,
  workOrderNumber,
  onClose,
}: {
  workOrderId: string;
  workOrderNumber: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [decision, setDecision] = useState<Decision>("approved");
  const [note, setNote] = useState("");

  const mutation = useProcessNOCApproval();

  function handleSubmit() {
    mutation.mutate(
      { id: workOrderId, data: { decision, note: note || undefined } },
      { onSuccess: () => onClose() }
    );
  }

  const hintText = decision === "approved"
    ? t("workOrder.detail.modals.noc.approvedHint")
    : t("workOrder.detail.modals.noc.rejectedHint");

  return (
    <ModalShell
      title={t("workOrder.detail.modals.noc.title")}
      subtitle={workOrderNumber}
      onClose={onClose}
      widthClass="max-w-lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            variant={decision === "rejected" ? "destructive" : "primary"}
            size="sm"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2 className="size-3 animate-spin mr-2" />}
            {t("workOrder.detail.modals.noc.submitDecision")}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <RadiusCredentialsPanel workOrderId={workOrderId} variant="compact" />

        <div>
          <FieldLabel required>{t("workOrder.detail.decision")}</FieldLabel>
          <div className="grid grid-cols-2 gap-2">
            {(["approved", "rejected"] as const).map((d) => {
              const active = decision === d;
              const activeClass =
                d === "approved"
                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20"
                  : "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20";
              const buttonText = d === "approved"
                ? t("workOrder.detail.modals.noc.approved")
                : t("workOrder.detail.modals.noc.rejected");
              return (
                <button
                  key={d}
                  onClick={() => setDecision(d)}
                  className={`px-3 py-3 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                    active
                      ? activeClass
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary"
                  }`}
                >
                  {buttonText}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{hintText}</p>
        </div>

        <div>
          <FieldLabel>{t("workOrder.detail.note")}</FieldLabel>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("workOrder.detail.modals.noc.placeholder")}
            className="min-h-[100px]"
          />
        </div>
      </div>
    </ModalShell>
  );
}
